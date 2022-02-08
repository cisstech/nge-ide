import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IDynamicModule } from '@cisstech/nge/services';
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';

import { DirectivesModule, PipesModule } from '@cisstech/nge-ide/core';

import { SearchComponent } from './search.component';
import { SearchInputComponent } from './search-input/search-input.components';

@NgModule({
    declarations: [
        SearchComponent,
        SearchInputComponent
    ],
    imports: [
        CommonModule,
        FormsModule,

        MatTooltipModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,

        PipesModule,
        DirectivesModule,

        NgeUiIconModule,
        NgeUiTreeModule,
    ],
})
export class SearchModule implements IDynamicModule {
    component = SearchComponent;
}
