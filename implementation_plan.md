# Goal: Build a Premium Cookie Consent System (Modern UI)

Implement a modern, Vercel/Stripe-like cookie consent system for ConverterForAll with Google Consent Mode v2 integration, precise local storage versioning, and fully accessible glassmorphism UI.

## User Review Required
> [!IMPORTANT]
> The default Google Consent Mode snippet will inject `analytics_storage = denied` and `ad_storage = denied` before any trackers load. Please confirm you are okay with this strict initial blocking to comply with GDPR/ePrivacy. 
> 
> Also, this will replace the hardcoded `gtag` placeholder in your `layout.tsx` with a dynamic version wrapped in the Consent logic.

## Open Questions
- Do you want Microsoft Clarity to be controlled under the **Analytics** category or the **Functional** category? I will place it under Analytics by default.
- Since we want zero impact on Lighthouse performance, I will lazy-load Google Analytics and Clarity only after consent is granted (or on first user interaction if granted). Is this acceptable?

## Proposed Changes

### Configuration & Context
#### [NEW] src/components/cookie-consent/cookie-context.tsx
- Create a React Context (`CookieConsentContext`) to globally manage consent state.
- Handle reading/writing to `localStorage` with versioning (e.g., `cfa_consent_v1`).
- Handle pushing `gtag('consent', 'update', ...)` to Google Consent Mode.
- Expose methods to open/close the modal and save preferences.

### UI Components
#### [NEW] src/components/cookie-consent/cookie-banner.tsx
- A floating glassmorphic card (bottom-right on desktop, bottom sheet on mobile).
- Tailwind styling for soft shadows, blur, and slide-in animations.
- Buttons: Accept All, Reject Optional, Customize.

#### [NEW] src/components/cookie-consent/cookie-modal.tsx
- Premium modal/dialog for detailed preferences.
- 4 Categories: Essential (disabled toggle), Analytics, Advertising, Functional.
- Custom accessible Switch/Toggle components.

#### [NEW] src/components/ui/toast.tsx
- Simple, accessible toast notification system to show "Your privacy preferences have been saved."

### Layout & Integrations
#### [MODIFY] src/app/layout.tsx
- Inject the Google Consent Mode v2 default snippet in the `<head>` *before* the GTM/GA4 placeholder.
- Wrap `children` with `<CookieConsentProvider>`.
- Add `<CookieBanner />` to the layout so it checks on every route.

#### [MODIFY] src/components/layout/footer.tsx
- Add a "Manage Cookies" button/link that triggers the Context to reopen the `CookieModal`.

## Verification Plan

### Automated/Manual Testing
1. **Lighthouse Check**: Ensure no performance drops (Lazy loading scripts).
2. **Initial State**: Verify `localStorage` is empty and GTM defaults are `denied`.
3. **Accept All**: Verify `localStorage` is set, `gtag('consent', 'update', { ...granted })` is fired.
4. **Reject All**: Verify non-essential cookies remain blocked.
5. **UI/UX**: Check mobile responsiveness, glassmorphism aesthetics, and keyboard accessibility (Tab navigation through the modal).
