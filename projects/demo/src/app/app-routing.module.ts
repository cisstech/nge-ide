import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { docsFromManifest } from '@cisstech/nge/doc'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'docs',
    loadChildren: () => import('@cisstech/nge/doc').then((m) => m.NGE_DOC_ROUTES),
    data: docsFromManifest('docs/nge-doc.json'),
  },
  {
    path: 'playground',
    loadChildren: () => import('./showcase/showcase.module').then((m) => m.ShowcaseModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Server rendering must wait for the lazy docs route to resolve before it
      // serializes, otherwise prerendered pages ship without their content.
      initialNavigation: 'enabledBlocking',
      scrollOffset: [0, 64],
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
