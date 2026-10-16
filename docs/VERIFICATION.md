# Verification record

Verified in a cloud build environment on 2026-10-16. No deployment was performed.

## Automated checks

- `bun install --frozen-lockfile`: passes with Bun 1.4.2.
- `bun run typecheck` and `bun run build`: pass. Vite reports its usual chunk-size advisory for the Three.js bundle.
- `bun test`: 11 tests pass (selection emphasis, picking, anatomy-tree adapter).
- `bun run verify:model`: 11 structure/FMA mappings, 75,496 triangles, 2,366,084 bytes; checksum, finite coordinates, and face indices verified.
- `bun run prepare:model` from the checksum-pinned cache regenerates a byte-identical GLB (SHA-256 `55f09dc6094bee040124a03ee6d5e69f8e89e3d8ae9567d880d5561169ea1608`).
- `bun run format:check`: passes.
- `src/framing.ts` is byte-identical to heart-3d's.

## Browser checks

Production build served by `bun run preview`, driven with Playwright in headless Chromium using SwiftShader (software WebGL). Desktop 1440 × 900 and mobile 390 × 844 (touch, 2× scale). These are real WebGL renders.

| Check | Result (desktop and mobile) |
| --- | --- |
| Initial load | The full model renders in the anterior view; status reads "11 of 11 structures visible". No page errors or console errors. |
| 3D selection | Clicking the centre of the model selects the ileum; it glows and the rest is ghosted. The chip shows "Ileum" and the view label stays "Anterior". |
| Panel | Anatomy opens with focus on the panel. Selecting Appendix in the tree updates the details card. Escape closes the panel and returns focus to the Anatomy toggle. |
| Isolate and reset | Isolate leaves 1 of 11 visible. Reset restores 11 of 11, the anterior view, and clears selection. |
| Views | Posterior shows the duodenum's C-shape and the rectum; left lateral shows the descending colon and rectum. Both visually checked. |
| Keyboard | Arrow-key rotation on the focused model changes the label to "Custom view". |
| Search | "colon" leaves the large intestine group with the three colon segments. |
| Guided tour | Five stops in order: duodenum (posterior), jejunum, appendix (isolated, 1 of 11), transverse colon, free taenia. |
| Layout | No horizontal overflow at either size. |

Not tested: physical phones, Safari, Firefox, screen readers, and real GPU context loss.
