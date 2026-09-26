---
'@_linked/css': patch
---

Declare `linkedPackage: true` in the manifest, so the package is discoverable by the Linked
tooling that keys on that flag (`getLincdPackages`, and the dependency pass of the Vite
`discoverWorkspaces`). No CSS, no export and no file list changes.
