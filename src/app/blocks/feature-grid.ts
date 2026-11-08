import { Component, computed, input } from '@angular/core'
import type { CmsComponent } from '@bifrost-orbit-cms/sdk'
import { Blocks } from './blocks'

type FeatureGridFields = { heading: string; intro?: string }

@Component({
  selector: 'cms-feature-grid',
  imports: [Blocks],
  template: `
    <section class="feature-grid" [attr.data-cms-id]="block().id">
      <h2>{{ fields().heading }}</h2>
      @if (fields().intro) {
        <p>{{ fields().intro }}</p>
      }
      <div class="grid">
        <cms-blocks [blocks]="block().children['items']" />
      </div>
    </section>
  `,
})
export class FeatureGrid {
  readonly block = input.required<CmsComponent>()
  protected readonly fields = computed(() => this.block().fields as FeatureGridFields)
}
