export interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
  submodules?: boolean
  build?: boolean
  iife?: boolean
  cjs?: boolean
  mjs?: boolean
  dts?: boolean
  target?: string
  utils?: boolean
  copy?: string[]
}

export const packages: PackageManifest[] = [
  {
    name: 'metadata',
    display: 'Metadata for Comuse functions',
    manualImport: true,
    iife: false,
    utils: true,
    target: 'node14',
  },
  {
    name: 'shared',
    display: 'Shared',
    description: 'Shared utilities',
    external: [
      '@ajiu9/shared',
    ],
  },
  {
    name: 'animation',
    display: 'Animation',
    description: 'Animation and Timeline utilities',
    external: [
      '@ajiu9/animation',
    ],
  },
  {
    name: 'ease',
    display: 'Ease',
    description: 'Ease functions',
    external: [
      '@ajiu9/ease',
    ],
  },
  {
    name: 'gesture',
    display: 'Gesture',
    description: 'Gesture functions',
    external: [
      '@ajiu9/gesture',
    ],
  },
]
