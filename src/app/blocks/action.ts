import { Component, computed, input } from '@angular/core'
import type { CmsComponent, CmsLink } from '@bifrost-orbit-cms/sdk'

type ActionFields = { label: string; link?: CmsLink | null }

@Component({
  selector: 'cms-action',
  template: `
    @if (fields().link?.href; as href) {
      <a [attr.data-cms-id]="block().id" [href]="href" [attr.target]="fields().link?.target">{{ fields().label }}</a>
    }
  `,
})
export class Action {
  readonly block = input.required<CmsComponent>()
  protected readonly fields = computed(() => this.block().fields as ActionFields)
}
