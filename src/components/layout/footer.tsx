import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight mb-4 inline-block">
              ConverterForAll
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Convert Anything. Anywhere. Instantly. The ultimate file conversion toolkit for modern workflows.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ConverterForAll. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
