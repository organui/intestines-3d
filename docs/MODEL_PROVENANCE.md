# Model provenance, scope, and review

## Source and license

The runtime model uses **BodyParts3D / Anatomography 4.3** (objects set 4.3, ontology tree FMA3.0), retrieved **2026-10-16**. Every selected OBJ header reports compatibility version 4.3, its own FJ file ID, concept ID, and English name.

The original project permits modification and redistribution of contour data and rendered images under **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)** ([legal text](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)). Its [license notice](https://lifesciencedb.jp/bp3d/info/index.html) is preserved as an inert [snapshot](model-source/original-license.html.txt) (the same snapshot used by lungs-3d). This license covers `public/models/intestines.glb`, the adapted model data, and model screenshots, separately from the MIT application code.

Credit: **BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS).** Adapted by OrganUI. No endorsement is implied. The [runtime notice](../public/models/LICENSE.txt) ships with the app, and the About dialog and footer link the license.

The LSDB archive's CC BY 4.0 grant applies to its BodyParts3D **4.0** archive. These are 4.3 assets, so the original service's share-alike terms are followed, as in lungs-3d and pancreas-3d.

## Retrieval and pinning

The official hosts (`dbarchive.biosciencedbc.jp`, `lifesciencedb.jp`) were not reachable from the build environment. The meshes were retrieved from the public [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) mirror of the complete 4.3 set, pinned at commit `fd527e6f4daf732fd814314d9257df5877b844bc`, the same commit lungs-3d uses.

- **Every OBJ was verified against the SHA-256 and byte size in its pinned Git LFS pointer.** [model-inputs.json](../scripts/model-inputs.json) records each download URL, pointer URL, mirror path, size, and hash.
- The concept-to-element mapping is the mirror's copy of the official version-stamped `FMA2Obj.txt` (SHA-256 `a199eb9cb258266768b7690f4ac2591f67d4b146c95e14046c46091c35c09385`). The PART-OF rows used are preserved unchanged in [FMA2Obj-4.3-selected.tsv](model-source/FMA2Obj-4.3-selected.tsv).
- [selected-elements.tsv](model-source/selected-elements.tsv) records each element's header (file ID, concept, name, version) and mirror path. `prepare-model.ts` re-reads every OBJ header and refuses any mismatch.
- The mirror's file names and `MANIFEST.csv` sometimes carry a different representation (BP) number or a broader FMA ID than the OBJ header. Identity and mapping use the FJ file ID and the header concept, not those values.

## Selection

Each structure is one official 4.3 PART-OF concept. Its meshes are exactly that concept's element list, and each of the 64 elements has exactly one owner.

| Structure | Concept | Elements |
| --- | --- | --- |
| Duodenum | FMA7206 | FJ2573 |
| Jejunum | FMA7207 | FJ2606–FJ2628 (23 loop segments; proximal FMA16981, middle FMA16982, distal FMA16983) |
| Ileum | FMA7208 | FJ2574–FJ2605 (32 loop segments; proximal FMA14964, middle FMA14965, distal FMA14966) |
| Appendix | FMA14542 | FJ2565 |
| Ascending colon | FMA14545 | FJ2566 |
| Transverse colon | FMA14546 | FJ2572 |
| Descending colon | FMA14547 | FJ2567 |
| Rectum | FMA14544 | FJ2571 |
| Mesocolic taenia | FMA15042 | FJ2569 (*Taenia mesocolica*) |
| Omental taenia | FMA15043 | FJ2570 (*Taenia omentalis*) |
| Free taenia | FMA15044 | FJ2568 (*Taenia libera*) |

The jejunum and ileum thirds are kept inside their parent structure rather than offered as six selectable parts; the source's thirds are not a common teaching boundary.

Inspected and excluded: the mesentery of the small intestine (FJ3396/FJ4650), mesoappendix, and transverse mesocolon, because they cover the loops and are not part of the requested organ; the pancreaticoduodenal vessels; and the stomach, which belongs to its own explorer. The 4.3 set has **no separate cecum or sigmoid colon** concept with geometry. The lower ascending colon and lower descending colon meshes cover those regions and are not cut or relabelled.

An earlier candidate, the BodyParts3D 3.0 STL mirror (Kevin-Mattheus-Moerman/BodyParts3D), supplies the colon as a single "colon, nsn" mesh. 4.3 was chosen because it separates the colon segments and matches the version and mirror used by lungs-3d.

## Conversion

1. Verify every pinned input checksum before reading it.
2. For each structure, read the concept's element list, check each OBJ header against the recorded metadata, and reject duplicate or unused elements.
3. Parse OBJ vertices and faces; triangulate polygons with a fan.
4. Apply one shared centre (the bounds of the whole selection), map `(x, y, z)` to `(x, z, −y)`, and scale uniformly by `0.012`. Source axes: +x patient-left, −y anterior, +z superior. Viewer: +x patient-left, +y superior, +z anterior. The scale is a display choice, not a calibration.
5. Recompute vertex normals and assign illustrative colours. No decimation, smoothing, or invented geometry.
6. Merge each structure's elements into one indexed mesh and store `structureId` and `fma` on its GLB node.

`bun run verify:model` independently checks the runtime checksum, every structure/FMA pair, finite coordinates, and valid indices. Output: 11 structures, 75,496 triangles, 2,366,084 bytes.

## Anatomy text and review

Descriptions are concise, original summaries of standard anatomy written for this demo. The interface links [NIDDK's digestive system overview](https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works) for the small intestine and [NCI SEER Training's intestine page](https://training.seer.cancer.gov/anatomy/digestive/regions/intestine.html) for the large intestine and taeniae as further reading. Those pages could not be fetched from the build environment, so **the text has not yet been checked against them**.

Completed: source identifier checks, mesh inspection, and interface verification. **Not completed: review by a clinical anatomy expert, or any clinical validation.** The source release warns that concepts and geometry can contain errors. The model represents one adult male and is not a universal or patient-specific reference.
