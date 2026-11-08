import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node'
import { verifyWebhook } from '@bifrost-orbit-cms/sdk'
import express, { type Request } from 'express'
import { join } from 'node:path'
import type { CmsPageContext } from './app/cms/page-context'
import { cms, PREVIEW_COOKIE, purge, resolvePage, safePath } from './cms.server'

const browserDistFolder = join(import.meta.dirname, '../browser')
const app = express()
const angularApp = new AngularNodeAppEngine()
const cookieOptions = { path: '/', httpOnly: true, secure: true, sameSite: 'none' } as const

function previewCookie(req: Request): string | undefined {
  const match = req.headers.cookie?.match(new RegExp(`(?:^|;\\s*)${PREVIEW_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

app.get('/api/preview', async (req, res) => {
  const token = req.query['preview'] ?? req.query['token']
  if (typeof token !== 'string' || !token) return void res.status(400).send('A preview token is required')
  const check = await cms().checkPreview(token)
  if (!check.valid) return void res.status(401).send('That preview link is invalid or has expired')
  res.cookie(PREVIEW_COOKIE, token, { ...cookieOptions, maxAge: 60 * 60 * 1000 })
  res.redirect(307, check.path ?? safePath(req.query['path']))
})

app.get('/api/preview/exit', (req, res) => {
  res.clearCookie(PREVIEW_COOKIE, cookieOptions)
  res.redirect(307, safePath(req.query['path']))
})

app.post('/api/cms-webhook', express.text({ type: '*/*' }), async (req, res) => {
  const secret = process.env['CMS_WEBHOOK_SECRET']
  if (!secret) return void res.sendStatus(401)
  const result = await verifyWebhook({
    body: typeof req.body === 'string' ? req.body : '',
    timestamp: req.get('x-orbit-timestamp'),
    signature: req.get('x-orbit-signature'),
    secret,
  })
  if (!result.valid) return void res.sendStatus(401)

  const { event } = result
  const data = result.data as { url?: string; previousUrl?: string }
  if (event === 'webhook.test') return void res.sendStatus(204)
  const moved = data.previousUrl && data.previousUrl !== data.url
  if (event.startsWith('content.') && data.url && !moved) purge(data.url)
  else purge()
  res.sendStatus(204)
})

app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }))

app.get('/{*path}', async (req, res, next) => {
  try {
    const token = typeof req.query['preview'] === 'string' ? req.query['preview'] : null
    if (token) return res.redirect(307, `/api/preview?${new URLSearchParams({ preview: token, path: req.path })}`)

    const { valid: preview } = await cms().checkPreview(previewCookie(req))
    const result = await resolvePage(req.path, preview)
    if (result.kind === 'redirect') return res.redirect(result.status, result.to)

    const context: CmsPageContext = { result, preview, bridge: `${cms().origin}/bridge.js` }
    const response = await angularApp.handle(req, context)
    return response ? writeResponseToNodeResponse(response, res) : next()
  } catch (error) {
    next(error)
  }
})

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000
  app.listen(port, (error) => {
    if (error) throw error
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

export const reqHandler = createNodeRequestHandler(app)
