import { InjectionToken, type Type } from '@angular/core'

export type BlockComponent = Type<unknown>

export const CMS_BLOCKS = new InjectionToken<Record<string, BlockComponent>>('CMS_BLOCKS')
