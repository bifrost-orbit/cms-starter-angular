import { Component, input, isDevMode } from '@angular/core'
import type { CmsComponent } from '@bifrost-orbit-cms/sdk'

@Component({
  selector: 'cms-fallback',
  template: `
    @if (dev) {
      <div [attr.data-cms-id]="block().id" style="border: 1px dashed; padding: 1rem">
        No component for <code>{{ block().type }}</code> yet
      </div>
    }
  `,
})
export class Fallback {
  readonly block = input.required<CmsComponent>()
  protected readonly dev = isDevMode()
}
