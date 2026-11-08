import type { BlockComponent } from './registry'
import { Action } from './action'
import { FeatureGrid } from './feature-grid'
import { FeatureItem } from './feature-item'
import { Hero } from './hero'

export const blocks: Record<string, BlockComponent> = {
  hero: Hero,
  featureGrid: FeatureGrid,
  featureItem: FeatureItem,
  action: Action,
}
