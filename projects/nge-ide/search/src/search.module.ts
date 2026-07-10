import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IDynamicModule } from '@cisstech/nge/services'
import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree'

import { EditorDirectivesModule, EditorPipesModule, SkeletonComponent, TooltipDirective } from '@cisstech/nge-ide/core'

import { SearchInputComponent } from './search-input/search-input.component'
import { SearchComponent } from './search.component'

@NgModule({
  declarations: [SearchComponent, SearchInputComponent],
  imports: [
    CommonModule,
    FormsModule,

    SkeletonComponent,
    TooltipDirective,

    EditorPipesModule,
    EditorDirectivesModule,

    NgeUiIconModule,
    NgeUiTreeModule,
  ],
  exports: [SearchComponent, SearchInputComponent],
})
export class SearchModule implements IDynamicModule {
  component = SearchComponent
}
