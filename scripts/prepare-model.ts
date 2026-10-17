import { mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { Document, NodeIO } from '@gltf-transform/core'
import { BufferGeometry, Float32BufferAttribute, Color } from 'three'
import inputs from './model-inputs.json'
import { structures } from '../src/anatomy'

const sha = (data: Uint8Array) => createHash('sha256').update(data).digest('hex')
await mkdir('.asset-cache/objs', { recursive: true })
await mkdir('public/models', { recursive: true })
for (const input of inputs.objects) {
  const path = `.asset-cache/objs/${input.file}`
  if (!(await Bun.file(path).exists())) {
    console.log(`Downloading ${input.file}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.file}: HTTP ${response.status}`)
    await Bun.write(path, response)
  }
  // Opened after any download: a Bun.file made before the write keeps a stale size.
  if (sha(new Uint8Array(await Bun.file(path).arrayBuffer())) !== input.sha256) {
    throw new Error(
      `Checksum mismatch: ${input.file}. Refusing changed upstream data; review it before updating the pin.`,
    )
  }
}
// Official 4.3 PART-OF rows for the selected concepts (see docs/MODEL_PROVENANCE.md).
const members = new Map(
  (await Bun.file('docs/model-source/FMA2Obj-4.3-selected.tsv').text())
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('\t'))
    .filter((r) => r[1] === 'part_of')
    .map((r) => [r[0], r[2].split('+')]),
)
const elementRows = new Map(
  (await Bun.file('docs/model-source/selected-elements.tsv').text())
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.split('\t'))
    .map((r) => [r[0], r]),
)

const doc = new Document()
doc.getRoot().getAsset().copyright =
  'BodyParts3D / Anatomography, © The Database Center for Life Science. CC BY-SA 2.1 Japan. Adapted by OrganUI.'
const scene = doc.createScene('OrganUI Intestines — BodyParts3D 4.3')
const buffer = doc.createBuffer()
const used = new Set<string>()
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity]
const prepared = []
for (const structure of structures) {
  const ids = members.get(structure.fma)
  if (!ids?.length) throw new Error(`Missing mapping: ${structure.fma}`)
  const positions: number[] = [],
    indices: number[] = []
  const sources = []
  for (const id of ids) {
    if (used.has(id)) throw new Error(`Duplicate ownership: ${id}`)
    used.add(id)
    const input = inputs.objects.find((i) => i.id === id)
    if (!input) throw new Error(`No pinned input for ${id}`)
    const bytes = new Uint8Array(await Bun.file(`.asset-cache/objs/${input.file}`).arrayBuffer())
    const text = new TextDecoder().decode(bytes)
    const header = (name: string) => text.match(new RegExp(`^# ${name} : (.+)$`, 'm'))?.[1].trim()
    const row = elementRows.get(id)
    if (
      !row ||
      header('File ID') !== id ||
      header('Concept ID') !== row[1] ||
      header('English name') !== row[2] ||
      header('Compatibility version') !== '4.3'
    )
      throw new Error(`Geometry header does not match recorded metadata: ${id}`)
    const offset = positions.length / 3
    let vertices = 0,
      triangles = 0
    for (const line of text.split(/\r?\n/)) {
      const tokens = line.trim().split(/\s+/)
      if (tokens[0] === 'v') {
        const v = tokens.slice(1, 4).map(Number)
        if (v.length !== 3 || !v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${id}`)
        v.forEach((p, i) => {
          min[i] = Math.min(min[i], p)
          max[i] = Math.max(max[i], p)
        })
        positions.push(...v)
        vertices++
      } else if (tokens[0] === 'f') {
        const face = tokens.slice(1).map((t) => {
          const i = Number(t.split('/')[0])
          return offset + (i > 0 ? i - 1 : vertices + i)
        })
        for (let i = 1; i < face.length - 1; i++) {
          indices.push(face[0], face[i], face[i + 1])
          triangles++
        }
      }
    }
    if (!vertices || !triangles) throw new Error(`Empty mesh: ${id}`)
    sources.push({
      element: id,
      concept: row[1],
      sourceName: row[2],
      sha256: input.sha256,
      bytes: bytes.length,
      vertices,
      triangles,
    })
  }
  if (indices.some((i) => !Number.isInteger(i) || i < 0 || i >= positions.length / 3))
    throw new Error(`Invalid topology: ${structure.id}`)
  prepared.push({ structure, positions, indices, sources })
}
const unused = inputs.objects.filter((i) => !used.has(i.id))
if (unused.length) throw new Error(`Unused input meshes: ${unused.map((i) => i.id)}`)

const center = min.map((v, i) => (v + max[i]) / 2)
const scale = 0.012 // millimeters to display units; uniform scale, no anatomical reshaping
for (const { structure, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    transformed[i] = (positions[i] - center[0]) * scale
    transformed[i + 1] = (positions[i + 2] - center[2]) * scale
    transformed[i + 2] = -(positions[i + 1] - center[1]) * scale
  }
  const geometry = new BufferGeometry()
    .setAttribute('position', new Float32BufferAttribute(transformed, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(transformed).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc
        .createAccessor()
        .setType('VEC3')
        .setArray(new Float32Array(geometry.getAttribute('normal').array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(indices)).setBuffer(buffer),
    )
    .setMaterial(material)
  const mesh = doc.createMesh(structure.id).addPrimitive(primitive)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(mesh)
      .setExtras({ structureId: structure.id, fma: structure.fma }),
  )
  geometry.dispose()
}
const runtime = await new NodeIO().writeBinary(doc)
await Bun.write('public/models/intestines.glb', runtime)
const manifest = {
  dataset: 'BodyParts3D / Anatomography',
  version: '4.3 (objects set 4.3, FMA3.0 tree)',
  mirror: 'https://github.com/olivercase/body_parts_3d_api',
  mirrorCommit: inputs.mirrorCommit,
  retrieved: '2026-10-16',
  license: 'CC-BY-SA-2.1-JP',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  credit: doc.getRoot().getAsset().copyright,
  transform: { sourceBoundsMm: { min, max }, centerMm: center, scale, axes: '[x, z, -y]' },
  runtime: { file: 'intestines.glb', bytes: runtime.byteLength, sha256: sha(runtime) },
  structures: prepared.map(({ structure, sources }) => ({
    id: structure.id,
    fma: structure.fma,
    sourceName: structure.sourceName,
    sources,
  })),
}
await Bun.write('public/models/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `Prepared ${structures.length} structures from ${used.size} source meshes, ${runtime.byteLength} bytes. SHA-256 ${sha(runtime)}`,
)
