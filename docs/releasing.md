# Releasing

Releases are started by hand. After that, the Chrome Web Store and Firefox Add-ons (AMO) uploads are automatic. If the AMO upload is skipped or fails, upload by hand: see [Firefox by hand (fallback)](#firefox-by-hand-fallback).

The workflows here are thin callers of the shared ones in [casteroid/webext-release](https://github.com/casteroid/webext-release). Its README explains how the version is chosen, the one-time store setup and the troubleshooting table. This page holds what is specific to this extension.

| Workflow | Trigger | What it does |
|---|---|---|
| `.github/workflows/ci.yml` | push to `main`, pull requests | Checks commit messages, type-checks, runs tests, builds and uploads the Chrome zip and the Firefox xpi as an artifact |
| `.github/workflows/release.yml` | manual (Actions tab) | Runs `npm run typecheck && npm test`, picks the version, commits it, tags `vX.Y.Z`, creates the GitHub release with the Chrome zip and the Firefox xpi, then uploads them to both stores |
| `.github/workflows/publish.yml` | manual with a tag | Uploads an existing release to both stores again |

The packages are `packages/copy-title-url-ext.v<version>.chrome.zip` and `packages/copy-title-url-ext.v<version>.firefox.xpi`, built by `npm run package`.

The workflows pin webext-release to a full commit SHA, with the tag in a comment. Dependabot opens a pull request when a new tag is out; update all three files together.

## Listings

- Chrome Web Store: item `eepifgllapjhlplohodldfjlipmbeeij`, <https://chromewebstore.google.com/detail/copy-title-and-url/eepifgllapjhlplohodldfjlipmbeeij>.
- Firefox Add-ons: `copy-title-and-url-ext`, guid `copy-title-url-ext@nunofaria11`, <https://addons.mozilla.org/en-US/firefox/addon/copy-title-and-url-ext/>.

Listing copy for both stores is in [`store/listing.md`](../store/listing.md).

## Store setup

Done, following the [webext-release store setup](https://github.com/casteroid/webext-release#store-setup-once-per-extension):

- Chrome, 2026-11-09: Workload Identity provider `copy-title-url` in project `chrome-web-store-api-258321`, and the repository variables `CWS_PUBLISHER_ID`, `CWS_EXTENSION_ID`, `CWS_PUBLISH_TYPE`, `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT`.
- Firefox, 2026-11-18: `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` in the `firefox-add-ons` environment, and the repository variable `AMO_ADDON_ID` = `copy-title-url-ext@nunofaria11`.

## Every release

1. Merge or push your Conventional Commits to `main` and wait for CI to pass.
2. **Actions → Release → Run workflow** on `main`. Optionally run a dry run first to read the notes.
3. Watch the reviews in the Chrome dashboard and the AMO Developer Hub. With `DEFAULT_PUBLISH` the Chrome version goes live as soon as it is approved.

To retry the store uploads for an existing release (for example after fixing a variable or a secret), run **Actions → Publish** with the tag, e.g. `v0.1.1`. Both store jobs run again; a store that already has the version fails on its own job only.

## Firefox by hand (fallback)

Use this when the AMO secrets are not set or the Firefox job failed.

1. Download `copy-title-url-ext.v<version>.firefox.xpi` from the GitHub release.
2. In the [AMO Developer Hub](https://addons.mozilla.org/developers/), open the add-on and click **Upload New Version**. Upload the xpi.
3. The xpi is an esbuild bundle, so AMO asks for the source code. Upload an archive of the tag:

   ```sh
   git archive --format=zip -o source.zip v<version>
   ```

   The build steps in [README.md](../README.md) are the build instructions reviewers need.
