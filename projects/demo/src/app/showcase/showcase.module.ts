import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShowcaseComponent } from './showcase.component';

@NgModule({
    imports: [
        CommonModule,

        RouterModule.forChild([
            { path: '', component: ShowcaseComponent }
        ])
    ],
    declarations: [ShowcaseComponent],
    providers: [],
})
export class ShowcaseModule { }
