# OrganUI Intestines development

- Work in this standalone repository. It has its own dependencies, configuration, and Git history. Keep the sibling OrganUI monorepo independent.
- Keep behaviour consistent with the other OrganUI explorers, with heart-3d as the reference. `src/framing.ts` must stay identical across explorers.
- Install `src/components/ui/anatomy-tree.tsx` from the OrganUI registry with the shadcn CLI; never hand-edit it (see `docs/REGISTRY_INTEGRATION.md`).
- Use Bun for dependency installation and scripts; commit the text lockfile.
- Use real anatomy assets whose redistribution terms have been checked. Record model provenance and attribution separately from the code license.
- Document which content and labels have been reviewed. Do not imply clinical validation or physiological accuracy that has not been established.
- Before delivery, run the build, type checks, tests, and model verification, and inspect the actual 3D rendering in a browser on desktop and mobile layouts.
- Keep the README's status and run instructions consistent with what has actually been implemented and verified.
