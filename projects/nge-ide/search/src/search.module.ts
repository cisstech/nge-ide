import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

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
