# Anatomy-tree registry integration

The anatomy panel uses the OrganUI registry item `anatomy-tree`, installed with the shadcn CLI. The installed source is tracked; runtime and ordinary setup never contact a registry.

## Exact installation

Installed on 2026-10-16:

```sh
REGISTRY_URL=http://127.0.0.1:4412 bunx shadcn@4.21.0 add http://127.0.0.1:4412/anatomy-tree.json -y -o
```

The build sandbox cannot reach `organui.com` or `ui.shadcn.com`, so the item was built from the OrganUI repository at `main` commit **42dc34f** (`bun run build` in `packages/registry`, which runs `shadcn build`) and served locally with `python3 -m http.server 4412`, together with shadcn's `colors/neutral.json` from the shadcn GitHub repository. With network access the equivalent command is `bunx shadcn@4.21.0 add https://organui.com/r/anatomy-tree.json -y -o`.

| Artifact                                     | SHA-256                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ |
| Served `anatomy-tree.json`                   | `719c1547afb1453e809ee1b2fca0dc99858083aa3ff712477a493c77e8f5f389` |
| Embedded `files[0].content`                  | `14709d69270066ebb4677e736d71fa59c2ec9cf9c1f0e1a6a8236795633944cd` |
| Tracked `src/components/ui/anatomy-tree.tsx` | `3d5554cdc179f1ad778fd6321cc1414c293c4cca0535efd9aab679c686893538` |

These match heart-3d's install. The CLI removed the `"use client"` directive for this non-RSC Vite target (`components.json` sets `"rsc": false`); nothing else differs from the published source. The file is listed in `.prettierignore` and must not be hand-edited. The CLI wrote `@base-ui/react` as `^1.8.0`; it was set back to the exact `1.8.0` pin.

## Application adapter

`src/anatomy-adapter.ts` builds the tree from `structures` and `groups` in `src/anatomy.ts`:

| Tree ID                 | Scene leaves (GLB `structureId`)                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `group-small-intestine` | `duodenum`, `jejunum`, `ileum`                                                           |
| `group-large-intestine` | `appendix`, `ascending-colon`, `transverse-colon`, `descending-colon`, `rectum`          |
| `group-taeniae-coli`    | `mesocolic-taenia`, `omental-taenia`, `free-taenia`                                      |

Group rows are interface groupings with `selectable: false`: activating one expands or collapses it, and its visibility button shows or hides all its structures. Leaves pass `color`, the same colour the renderer gives the mesh. `assertAnatomyMapping` throws at import on missing, unknown, or duplicate leaves, and `src/anatomy-adapter.test.ts` covers the adapter.

Behaviour matches heart-3d: single-structure selection, the app's `hidden` set as the source of visibility, Reset remounting the tree to clear search and expansion, the component's built-in reveal for selections made in 3D, and one effect that scrolls an existing selection into the tree's own scroll area when the panel opens.
