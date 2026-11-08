import { Component, DOCUMENT, inject, REQUEST_CONTEXT, RESPONSE_INIT, TransferState } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import type { CmsPage as CmsPageData } from '@bifrost-orbit-cms/sdk'
import { Blocks } from '../blocks/blocks'
import { CMS_PAGE, type CmsPageContext } from './page-context'

@Component({
  selector: 'cms-page',
  imports: [Blocks],
  template: `
    @if (page; as page) {
      <main><cms-blocks [blocks]="page.components" /></main>
    } @else {
      <main>
        <h1>{{ gone ? 'This page has been removed' : 'We could not find that page' }}</h1>
        <p><a href="/">Back to the home page</a></p>
      </main>
    }
  `,
})
export class CmsPage {
  protected readonly page: CmsPageData | null
  protected readonly gone: boolean

  constructor() {
    const state = inject(TransferState)
    const server = inject(REQUEST_CONTEXT, { optional: true }) as CmsPageContext | null
    if (server) state.set(CMS_PAGE, server)
    const context = server ?? state.get(CMS_PAGE, null)
    const result = context?.result

    this.page = result?.kind === 'page' ? result.page : null
    this.gone = result?.kind === 'gone'

    const response = inject(RESPONSE_INIT, { optional: true })
    if (response && !this.page) response.status = this.gone ? 410 : 404

    if (server) this.writeHead(server)
  }

  private writeHead(context: CmsPageContext) {
    const document = inject(DOCUMENT)
    inject(Title).setTitle(this.page?.seo.title ?? 'Page not found')
    if (!this.page) return
    inject(Meta).updateTag({ name: 'description', content: this.page.seo.description })

    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = this.page.seo.canonical
    document.head.appendChild(canonical)

    if (context.preview) {
      const bridge = document.createElement('script')
      bridge.src = context.bridge
      bridge.defer = true
      document.head.appendChild(bridge)
    }
  }
}
