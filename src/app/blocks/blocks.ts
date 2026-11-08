import { Component, inject, input } from '@angular/core'
import { NgComponentOutlet } from '@angular/common'
import type { CmsComponent } from '@bifrost-orbit-cms/sdk'
import { Fallback } from './fallback'
import { CMS_BLOCKS } from './registry'

@Component({
  selector: 'cms-blocks',
  imports: [NgComponentOutlet],
  template: `
    @for (block of blocks(); track block.id) {
      <ng-container *ngComponentOutlet="registry[block.type] ?? fallback; inputs: { block }" />
    }
  `,
})
export class Blocks {
  readonly blocks = input<CmsComponent[] | undefined>([])
  protected readonly registry = inject(CMS_BLOCKS)
  protected readonly fallback = Fallback
}
