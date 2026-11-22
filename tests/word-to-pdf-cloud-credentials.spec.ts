import { test, expect } from '@playwright/test';
import { NextRequest } from 'next/server';
import { POST as wordToPdfPost } from '../src/app/api/convert-word-to-pdf/route';
import { POST as pptxToPdfPost } from '../src/app/api/convert-powerpoint-to-pdf/route';
import fs from 'fs';
import path from 'path';

test.describe('Word & PowerPoint Cloud Conversion Credential Security', () => {
  const originalEnv = { ...process.env };

  test.afterEach(() => {
    // Restore original environment variables after each test
    process.env = { ...originalEnv };
  });

  test('1. Missing API key returns controlled 503 fallback without upstream calls', async () => {
    delete process.env.CLOUDMERSIVE_API_KEY;
    delete process.env.GOTENBERG_URL;
    delete process.env.DOCX_CONVERTER_URL;
    delete process.env.LIBREOFFICE_API_URL;

    let fetchCalled = false;
    const originalFetch = global.fetch;
    global.fetch = (async () => {
      fetchCalled = true;
      return new Response('Mock error', { status: 500 });
    }) as typeof global.fetch;

    try {
      const formData = new FormData();
      const dummyFile = new File(['dummy docx content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      formData.append('file', dummyFile);

      const req = new NextRequest('http://localhost:3000/api/convert-word-to-pdf', {
        method: 'POST',
        body: formData,
      });

      const res = await wordToPdfPost(req);
      expect(res.status).toBe(503);
      expect(fetchCalled).toBe(false);

      const json = await res.json();
      expect(json.status).toBe('client_fallback');
      expect(json.message).toContain('unconfigured or unavailable');
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('2. Configured API key triggers Cloudmersive request with Apikey header and returns PDF on success', async () => {
    const dummyKey = 'test-canary-cloud-key-12345';
    process.env.CLOUDMERSIVE_API_KEY = dummyKey;

    let capturedUrl = '';
    let capturedHeaders: Record<string, string> = {};

    const originalFetch = global.fetch;
    // Generate valid dummy PDF bytes (> 100 bytes)
    const mockPdfBytes = new Uint8Array(200).fill(65);

    global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString();
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((v, k) => { capturedHeaders[k] = v; });
        } else if (typeof init.headers === 'object') {
          capturedHeaders = { ...(init.headers as Record<string, string>) };
        }
      }
      return new Response(mockPdfBytes, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      });
    }) as typeof global.fetch;

    try {
      const formData = new FormData();
      const dummyFile = new File(['dummy docx content'], 'report.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      formData.append('file', dummyFile);

      const req = new NextRequest('http://localhost:3000/api/convert-word-to-pdf', {
        method: 'POST',
        body: formData,
      });

      const res = await wordToPdfPost(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/pdf');
      expect(capturedUrl).toBe('https://api.cloudmersive.com/convert/docx/to/pdf');
      expect(capturedHeaders['Apikey']).toBe(dummyKey);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('3. Upstream 401/403/429 errors return controlled 503 without leaking credentials', async () => {
    const dummyKey = 'secret-canary-key-999888';
    process.env.CLOUDMERSIVE_API_KEY = dummyKey;
    delete process.env.GOTENBERG_URL;
    delete process.env.DOCX_CONVERTER_URL;
    delete process.env.LIBREOFFICE_API_URL;

    const originalFetch = global.fetch;
    global.fetch = (async () => {
      // Upstream returns 401 with a payload that echoes something
      return new Response(
        JSON.stringify({ error: `Invalid key provided: ${dummyKey}`, code: 401 }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }) as typeof global.fetch;

    try {
      const formData = new FormData();
      const dummyFile = new File(['dummy docx content'], 'sample.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      formData.append('file', dummyFile);

      const req = new NextRequest('http://localhost:3000/api/convert-word-to-pdf', {
        method: 'POST',
        body: formData,
      });

      const res = await wordToPdfPost(req);
      expect(res.status).toBe(503);

      const rawBody = await res.text();
      // Crucial: The secret key must NEVER appear in the client response
      expect(rawBody).not.toContain(dummyKey);
      expect(rawBody).toContain('client_fallback');
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('4. PowerPoint endpoint securely handles missing API key and returns 503 fallback', async () => {
    delete process.env.CLOUDMERSIVE_API_KEY;
    delete process.env.GOTENBERG_URL;
    delete process.env.DOCX_CONVERTER_URL;
    delete process.env.LIBREOFFICE_API_URL;

    const formData = new FormData();
    const dummyFile = new File(['dummy pptx content'], 'slides.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    formData.append('file', dummyFile);

    const req = new NextRequest('http://localhost:3000/api/convert-powerpoint-to-pdf', {
      method: 'POST',
      body: formData,
    });

    const res = await pptxToPdfPost(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.status).toBe('client_fallback');
  });

  test('5. Static source code security audit verifies zero hardcoded credential fallbacks', () => {
    const wordRoutePath = path.join(process.cwd(), 'src/app/api/convert-word-to-pdf/route.ts');
    const pptRoutePath = path.join(process.cwd(), 'src/app/api/convert-powerpoint-to-pdf/route.ts');

    const wordSource = fs.readFileSync(wordRoutePath, 'utf-8');
    const pptSource = fs.readFileSync(pptRoutePath, 'utf-8');

    // Neither file should have a fallback string literal following CLOUDMERSIVE_API_KEY
    expect(wordSource).not.toMatch(/process\.env\.CLOUDMERSIVE_API_KEY\s*\|\|\s*["']/);
    expect(pptSource).not.toMatch(/process\.env\.CLOUDMERSIVE_API_KEY\s*\|\|\s*["']/);

    // Neither file should log raw upstream error response text
    expect(wordSource).not.toContain('errText');
    expect(pptSource).not.toContain('errText');

    // .gitignore must contain .env rule
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    expect(gitignore).toMatch(/\.env\*/);
  });
});
