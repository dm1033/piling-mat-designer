# Piling Mat Designer — offline Android edition

Paid-download Android adaptation of the existing calculation tool. This is a **pre-release candidate**, not a Google Play publication or independently validated engineering product. The existing website is unchanged.

## Included

- Cohesive / granular inputs and optional reinforcement using the existing `client/src/lib/bre470-calc.ts` engine.
- Mobile input validation and rejection of inadequate-material results, even where the legacy engine returns `pass`.
- Automatic result invalidation after input edits.
- Local named input snapshots, load/recalculate and confirmed deletion.
- Calculation trace, schematic section and Android print-to-PDF marked **DRAFT — NOT FOR CONSTRUCTION**.
- Offline local assets with no INTERNET permission, remote pages, analytics, billing SDK, account or JavaScript-to-Java bridge.
- Android API 36 target, minimum API 26. A separate `.preview` package for debug installations.

The paid download provides the calculation software. It does not purchase a signed design, certificate, independent check, site approval or formal engineering service. Google Play handles the upfront app purchase; there are no in-app purchases in this edition. David approved a UK one-off download price of **£49.99 GBP** on 31 October 2026. This is recorded for release setup and has not yet been configured in Play Console.

## Build

Requirements: Node 22+, pnpm 10.4.1, JDK 17, Gradle 8.13, Android SDK platform 36 and Build Tools 36.0.0. Install dependencies using the repository's package manager and lockfile.

From repository root:

```sh
pnpm install --frozen-lockfile
pnpm exec vitest run --config mobile/vitest.config.ts
pnpm exec tsc -p mobile/tsconfig.json
pnpm exec vite build --config mobile/vite.config.ts
cd mobile/android
gradle assembleDebug bundleRelease lintDebug
```

Set ANDROID_HOME or an ignored local.properties with sdk.dir before running Gradle. Gradle 8.13 can also generate a wrapper with `gradle wrapper --gradle-version 8.13`.

Outputs:

- `mobile/android/app/build/outputs/apk/debug/app-debug.apk` — debug-signed testing APK; not a commercial release.
- `mobile/android/app/build/outputs/bundle/release/app-release.aab` — unsigned release bundle; requires the owner's upload-key signature before Play submission.

Use Android Studio's **Build → Generate Signed App Bundle / APK** to create the production upload key under the owner's control, or sign the unsigned AAB using `jarsigner` with the owner's existing upload key. Do not use the debug key. Never commit keystores or passwords. Keep the upload key backed up securely and enrol in Play App Signing.

## Verification boundaries

Automated checks exercise mobile validation, engine parity, inadequate-material blocking and stored-data decoding. They are software regressions, not an independent BR 470 design check. The underlying formulas, constants, reinforcement factors and all claimed method applicability require a competent technical review against licensed current guidance before commercial release.

Native device testing must cover Android 8 and a current Android 16 phone/tablet; offline launch; keyboard and system bar insets; rotation; font scaling; app background/resume; saved projects across process restart; failed calculations; zero-thickness output; Save as PDF; cancellation of printing; and the release-signed build installed through Play internal testing.

The cloud browser could not reach the local test server in this session. Browser interaction tests and Android device/print tests are not claimed as passed. See `docs/release-checklist.md` and the delivered build verification record for actual results.

## Engine review findings

1. The legacy granular engine can report pass when `platformMaterialAdequate` is false. The mobile adapter blocks it; the website engine is untouched.
2. The groundwater flag does not alter the calculation: the engine uses the supplied subgrade unit weight directly. The mobile UI explicitly requires the appropriate effective value and records the flag only.
3. The legacy reinforcement calculation applies `Td = Tult / 2`; the mobile UI exposes that assumption. No manufacturer certification or product suitability is inferred.
4. Mobile outputs must not reuse the website's automatically signed-certificate claims. No signature/certificate functionality is included here.

Saved data uses `twcd.pilingmat.projects.v1` in WebView localStorage. Auto-backup and device transfer are excluded. Deleting the app removes local projects. PDF copies saved through a chosen print provider are controlled separately by the user/provider.
