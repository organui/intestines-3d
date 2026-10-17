export type Structure = {
  id: string
  /** BodyParts3D 4.3 PART-OF concept whose element meshes form this structure. */
  fma: string
  name: string
  sourceName: string
  group: 'Small intestine' | 'Large intestine' | 'Taeniae coli'
  color: string
  description: string
  note: string
}

export const anatomySource =
  'https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works'
export const largeIntestineSource =
  'https://training.seer.cancer.gov/anatomy/digestive/regions/intestine.html'
export const structures: Structure[] = [
  {
    id: 'duodenum',
    fma: 'FMA7206',
    name: 'Duodenum',
    sourceName: 'Duodenum',
    group: 'Small intestine',
    color: '#d9a07c',
    description:
      'The first, C-shaped part of the small intestine. It receives food from the stomach along with bile and pancreatic juices.',
    note: 'Mostly hidden behind the transverse colon from the front; use the posterior view. The stomach, pancreas, and bile ducts are not included.',
  },
  {
    id: 'jejunum',
    fma: 'FMA7207',
    name: 'Jejunum',
    sourceName: 'Jejunum (proximal, middle, and distal parts)',
    group: 'Small intestine',
    color: '#d68b80',
    description:
      'The middle part of the small intestine, where much of the digestion and absorption of nutrients takes place.',
    note: 'The source supplies 23 loop segments, grouped here as one structure. The boundary with the ileum is the source’s; in the body the change is gradual. The mesentery is omitted.',
  },
  {
    id: 'ileum',
    fma: 'FMA7208',
    name: 'Ileum',
    sourceName: 'Ileum (proximal, middle, and distal parts)',
    group: 'Small intestine',
    color: '#c47783',
    description:
      'The last part of the small intestine. It continues absorbing nutrients and joins the large intestine in the lower right abdomen.',
    note: 'The source supplies 32 loop segments, grouped here as one structure. The ileocecal valve is not modelled separately.',
  },
  {
    id: 'appendix',
    fma: 'FMA14542',
    name: 'Appendix',
    sourceName: 'Appendix',
    group: 'Large intestine',
    color: '#b5868f',
    description:
      'A narrow, finger-shaped pouch that projects from the beginning of the large intestine in the lower right abdomen.',
    note: 'Small and partly hidden from the front. Isolate it or use the posterior view.',
  },
  {
    id: 'ascending-colon',
    fma: 'FMA14545',
    name: 'Ascending colon',
    sourceName: 'Ascending colon',
    group: 'Large intestine',
    color: '#c2a17a',
    description:
      'Rises along the right side of the abdomen from the start of the large intestine toward the liver. The colon absorbs water and forms stool.',
    note: 'The source has no separate cecum; the lowest part of this mesh stands in for it.',
  },
  {
    id: 'transverse-colon',
    fma: 'FMA14546',
    name: 'Transverse colon',
    sourceName: 'Transverse colon',
    group: 'Large intestine',
    color: '#b8956c',
    description: 'Crosses the upper abdomen from right to left, below the liver and stomach.',
    note: 'Its mesentery, the transverse mesocolon, is omitted.',
  },
  {
    id: 'descending-colon',
    fma: 'FMA14547',
    name: 'Descending colon',
    sourceName: 'Descending colon',
    group: 'Large intestine',
    color: '#ad8a63',
    description: 'Runs down the left side of the abdomen and carries stool toward the rectum.',
    note: 'The source has no separate sigmoid colon; this mesh continues down toward the rectum.',
  },
  {
    id: 'rectum',
    fma: 'FMA14544',
    name: 'Rectum',
    sourceName: 'Rectum',
    group: 'Large intestine',
    color: '#a07c5e',
    description:
      'The final straight section of the large intestine, in the pelvis, which stores stool until it leaves the body through the anus.',
    note: 'The anal canal and pelvic floor muscles are not included.',
  },
  {
    id: 'mesocolic-taenia',
    fma: 'FMA15042',
    name: 'Mesocolic taenia',
    sourceName: 'Taenia mesocolica',
    group: 'Taeniae coli',
    color: '#e3cfa6',
    description:
      'One of three ribbon-like bands of longitudinal muscle on the colon. It runs along the side where the colon is attached by its mesentery.',
    note: 'The taeniae lie on the colon surface. Hide the colon or isolate a band to follow it along its length.',
  },
  {
    id: 'omental-taenia',
    fma: 'FMA15043',
    name: 'Omental taenia',
    sourceName: 'Taenia omentalis',
    group: 'Taeniae coli',
    color: '#d8c08d',
    description:
      'A band of longitudinal colon muscle that, on the transverse colon, runs where the greater omentum attaches.',
    note: 'The taeniae lie on the colon surface. Hide the colon or isolate a band to follow it along its length.',
  },
  {
    id: 'free-taenia',
    fma: 'FMA15044',
    name: 'Free taenia',
    sourceName: 'Taenia libera',
    group: 'Taeniae coli',
    color: '#ead9b6',
    description:
      'The band of longitudinal colon muscle with no attachment, visible on the front of the ascending and descending colon.',
    note: 'The taeniae lie on the colon surface. Hide the colon or isolate a band to follow it along its length.',
  },
]
export const groups = ['Small intestine', 'Large intestine', 'Taeniae coli'] as const
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Posterior' | 'Left lateral'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'duodenum',
    title: 'Leaving the stomach',
    text: 'Start behind the colon at the duodenum, the C-shaped first part of the small intestine. The stomach would sit just above it.',
    view: 'Posterior',
  },
  {
    id: 'jejunum',
    title: 'Coils in the middle',
    text: 'The jejunum and then the ileum fill the centre of the abdomen in folded loops. The ileum ends low on the right, where the large intestine begins.',
    view: 'Anterior',
  },
  {
    id: 'appendix',
    title: 'A small pouch',
    text: 'The appendix is isolated here. It hangs from the start of the large intestine, low on the right. Restore all to see where it sits.',
    view: 'Anterior',
    isolate: true,
  },
  {
    id: 'transverse-colon',
    title: 'A frame around the coils',
    text: 'The colon rises on the right, crosses the top as the transverse colon, and descends on the left, framing the small intestine.',
    view: 'Anterior',
  },
  {
    id: 'free-taenia',
    title: 'Three bands of muscle',
    text: 'Taeniae coli are three ribbons of longitudinal muscle along the colon. Hide the colon to follow them on their own.',
    view: 'Anterior',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry (appendix, taeniae).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
