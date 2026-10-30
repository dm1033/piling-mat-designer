# Commercial release checklist

Prepared 30 October 2026. Publication has **not** occurred.

1. Complete a competent technical review of the source calculation method and independent benchmark cases against the licensed BR 470 guidance. Investigate the material-check issue identified in the existing granular engine. Software parity tests do not establish engineering correctness.
2. Test the APK on real Android devices, including David's Samsung S25 Ultra. Check airplane-mode operation, valid/invalid cases, large font sizes, keyboard access, device rotation, project save/reload/delete and PDF output.
3. Agree the price, launch countries and exact purchased entitlement. Current scope is one paid download of the offline calculation aid. Formal design services are excluded.
4. Use the company's Google Play developer account, complete any identity/organisation checks and merchant setup, and confirm the package ID `com.temporaryworksconsulting.pilingmatdesigner` before its first upload. Package IDs cannot simply be renamed after publication.
5. Create or select an owner-controlled upload signing key. Sign the release AAB; keep credentials outside chat and source control. The preview APK uses a separate debug package and is not suitable for sale.
6. Publish the privacy policy at a publicly accessible HTTPS URL, complete Data safety, app access, ads, audience and content-rating declarations, and supply accurate store graphics/screenshots.
7. Upload the signed AAB to internal testing first. Check Google's pre-launch report and all device failures. Some newer personal accounts require at least 12 opted-in testers for 14 continuous days before applying for production access; confirm the requirement shown in this account.
8. Submit the tested release for Google review. Do not advertise the app as live until approved and available. Keep the app paid from its initial commercial publication if the paid-download model is to be retained.

## Official references checked in this task

- App Bundle requirement: https://developer.android.com/guide/app-bundle
- Target API requirement (API 36 for new phone/tablet submissions from 31 August 2026): https://support.google.com/googleplay/android-developer/answer/11926878
- Payment policy: https://support.google.com/googleplay/android-developer/answer/9858738
- Personal account testing: https://support.google.com/googleplay/android-developer/answer/14151465
- Internal tests: https://support.google.com/googleplay/android-developer/answer/9845334
- Local WebView assets: https://developer.android.com/develop/ui/views/layout/webapps/load-local-content

Recheck current Play Console requirements when submitting. AppDeploy's exposed tools provide web hosting, not native Android signing/building or Play Store publishing; the Android package is built separately.
