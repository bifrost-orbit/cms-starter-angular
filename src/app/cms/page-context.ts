import { makeStateKey } from '@angular/core'
import type { CmsResolution } from '@bifrost-orbit-cms/sdk'

export type CmsPageContext = {
  result: CmsResolution
  preview: boolean
  bridge: string
}

export const CMS_PAGE = makeStateKey<CmsPageContext>('cms-page')
