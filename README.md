# DOTO Army

Economic-war arcade game for DotOne (DOTO) fans: collect transactions, forge blocks, build and level up your farm, bridge to other chains, fend off scammers and drainers, survive Rug Pulls, and climb the staking ladder.

- `web/` – the game (single `index.html` + images). Opens directly in a browser.
- `scripts/build-www.mjs` – bundles the game for offline use (three.js r128, post-processing, Vazirmatn / Chakra Petch fonts) into the Android assets.
- `android/` – minimal full-screen WebView app (`com.dotone.dotoarmy`) that serves the game from a secure local origin.
- `.github/workflows/android.yml` – builds the APK on every push to `main` and publishes it as a GitHub Release.

## Signing

Release APKs are signed with the key in the repository secrets `DOTO_KEYSTORE_B64` (base64 of the `.jks`) and `DOTO_KEYSTORE_PASSWORD` (alias `dotoarmy`). Without them the workflow builds a debug APK. Keep the keystore safe: store updates (e.g. Cafe Bazaar) must be signed with the same key.

## Local build

```
npm install
node scripts/build-www.mjs
gradle -p android assembleDebug   # needs the Android SDK
```
