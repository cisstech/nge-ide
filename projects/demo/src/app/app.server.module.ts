import { NgModule, provideZoneChangeDetection } from '@angular/core'
import { provideServerRendering, withRoutes } from '@angular/ssr'
import { provideNgeDocSsr } from '@cisstech/nge/doc/ssr'

import { AppComponent } from './app.component'
import { AppModule } from './app.module'
import { serverRoutes } from './app.routes.server'

@NgModule({
  imports: [AppModule],
  providers: [
    // The browser bootstrap (main.ts) sets up zone change detection; the server
    // needs it too, otherwise async markdown never triggers CD before the page
    // is serialized and prerendered pages ship without their content.
    provideZoneChangeDetection(),
    provideServerRendering(withRoutes(serverRoutes)),
    provideNgeDocSsr({ roots: ['projects/demo/public'] }),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
