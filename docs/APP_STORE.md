# Once Humans App Store Path

## Chosen Approach

Use the production web app as a PWA first, then wrap it with Capacitor for iOS and Android. This keeps one product surface while the app is still changing quickly.

## PWA Requirements

- Manifest route exists at `/manifest.webmanifest`.
- App icon exists at `/once-humans-icon.svg`.
- The site should be usable on mobile viewport sizes before wrapping.
- Auth, uploads, chat, and navigation must work from the installed browser app.

## Native Wrapper Milestone

After the production website is stable:

1. Install Capacitor packages.
2. Add iOS and Android projects.
3. Point the wrapper to the production web app URL or bundled web output.
4. Configure safe-area behavior, status bar color, camera/photo permissions, and external link handling.
5. Test login persistence and media uploads on physical devices.

## Apple App Store

- Enroll in the Apple Developer Program.
- Create the app in App Store Connect.
- Prepare:
  - app name, subtitle, description, keywords,
  - screenshots for required device sizes,
  - privacy policy URL,
  - app privacy questionnaire,
  - age rating,
  - support URL.
- Test with TestFlight before App Review.

## Google Play

- Create a Google Play Console account.
- Prepare:
  - app name, short/full description,
  - screenshots and feature graphic,
  - privacy policy URL,
  - Data Safety form,
  - content rating,
  - target audience details.
- New personal developer accounts may need closed testing with at least 12 testers opted in for 14 continuous days before production.

## Store Review Risks To Resolve First

- User-generated content needs moderation/reporting.
- Auth and account deletion expectations must be clear.
- Privacy policy must describe uploads, profiles, posts, chat, and analytics if added.
- The wrapped app must provide enough app-like value and quality to satisfy store review.
