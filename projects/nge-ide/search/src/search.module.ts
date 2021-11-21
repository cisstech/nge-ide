import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgeUiIconModule } from '@mcisse/nge/ui/icon';
import { SearchInputComponent } from './search-input/search-input.components';
import { IDynamicModule } from '@mcisse/nge/services';
import { SearchComponent } from './search.component';

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
        NgeUiIconModule
    ],
})
export class SearchModule implements IDynamicModule {
    component = SearchComponent;
}
