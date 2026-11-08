import { createCmsClient, type CmsClient, type CmsResolution } from '@bifrost-orbit-cms/sdk'

let client: CmsClient | undefined

export function cms(): CmsClient {
  client ??= createCmsClient({
    baseUrl: process.env['CMS_API_URL']!,
    apiKey: process.env['CMS_PUBLIC_KEY']!,
    previewKey: process.env['CMS_PREVIEW_KEY'],
    defaultRegion: process.env['CMS_DEFAULT_REGION'],
  })
  return client
}

const MAX_AGE_MS = 60_000
const pages = new Map<string, { at: number; result: Promise<CmsResolution> }>()

export function resolvePage(path: string, preview: boolean): Promise<CmsResolution> {
  if (preview) return cms().resolve({ path, preview: true })
  const cached = pages.get(path)
  if (cached && Date.now() - cached.at < MAX_AGE_MS) return cached.result
  const result = cms().resolve({ path })
  pages.set(path, { at: Date.now(), result })
  result.catch(() => pages.delete(path))
  return result
}

export function purge(path?: string) {
  if (path) pages.delete(path)
  else pages.clear()
}

export const PREVIEW_COOKIE = 'cms_preview'

export function safePath(path: unknown): string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') ? path : '/'
}
