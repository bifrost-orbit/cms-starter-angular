import { Component, computed, input } from '@angular/core'
import type { CmsComponent, CmsLink } from '@bifrost-orbit-cms/sdk'

type FeatureItemFields = { title: string; body?: string; link?: CmsLink | null }

@Component({
  selector: 'cms-feature-item',
  template: `
    <article [attr.data-cms-id]="block().id">
      <h3>{{ fields().title }}</h3>
      @if (fields().body) {
        <p>{{ fields().body }}</p>
      }
      @if (fields().link?.href; as href) {
        <a [href]="href">Read more</a>
      }
    </article>
  `,
})
export class FeatureItem {
  readonly block = input.required<CmsComponent>()
  protected readonly fields = computed(() => this.block().fields as FeatureItemFields)
}
