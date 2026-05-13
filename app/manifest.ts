import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Once Humans',
    short_name: 'Once Humans',
    description: 'A living museum and social space for human-made things and human stories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4ead4',
    theme_color: '#0f172a',
    orientation: 'portrait',
    icons: [
      {
        src: '/once-humans-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/once-humans-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
