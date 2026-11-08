import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { blocks } from './blocks'
import { CMS_BLOCKS } from './blocks/registry'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    { provide: CMS_BLOCKS, useValue: blocks },
  ],
}
