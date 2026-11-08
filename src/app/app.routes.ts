import { Routes } from '@angular/router'
import { CmsPage } from './cms/cms-page'

export const routes: Routes = [{ path: '**', component: CmsPage }]
