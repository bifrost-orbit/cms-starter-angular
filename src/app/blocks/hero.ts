import { Component, computed, input } from '@angular/core'
import type { CmsComponent } from '@bifrost-orbit-cms/sdk'
import { Blocks } from './blocks'

type HeroFields = { eyebrow?: string; heading: string; description?: string }

@Component({
  selector: 'cms-hero',
  imports: [Blocks],
  template: `
    <section class="hero" [attr.data-cms-id]="block().id">
      @if (fields().eyebrow) {
        <p>{{ fields().eyebrow }}</p>
      }
      <h1>{{ fields().heading }}</h1>
      <div [innerHTML]="fields().description ?? ''"></div>
      <cms-blocks [blocks]="actions()" />
    </section>
  `,
})
export class Hero {
  readonly block = input.required<CmsComponent>()
  protected readonly fields = computed(() => this.block().fields as HeroFields)
  protected readonly actions = computed(() => [
    ...(this.block().children['primaryAction'] ?? []),
    ...(this.block().children['secondaryAction'] ?? []),
  ])
}
