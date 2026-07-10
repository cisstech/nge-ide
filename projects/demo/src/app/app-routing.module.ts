import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { IDE_DOCS } from './docs/ide'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'docs',
    loadChildren: () => import('@cisstech/nge/doc').then((m) => m.NGE_DOC_ROUTES),
    data: [IDE_DOCS],
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
      scrollOffset: [0, 64],
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
