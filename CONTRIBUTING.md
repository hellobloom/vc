## Bumping a package version

*DO NOT* use `lerna version`, because of how lerna works and how we have these packages structured you should update the package's version manually.

## Publishing a package

*DO NOT* use just `lerna publish`.

After bumping the version, making changes, and updating the CHANGELOG for the package run `lerna publish from-package` this will release any unreleased packages based on the npm registry and the versions of the local packages.
