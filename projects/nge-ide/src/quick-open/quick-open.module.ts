import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete'

import { NgeUiIconModule } from '@cisstech/nge/ui/icon';

import { PipesModule } from '@cisstech/nge-ide/core';

import { QuickOpenComponent } from './quick-open.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatAutocompleteModule,

        PipesModule,
        NgeUiIconModule,
    ],
    exports: [
        QuickOpenComponent,
    ],
    declarations: [
        QuickOpenComponent,
    ]
})
export class QuickOpenModule {}
