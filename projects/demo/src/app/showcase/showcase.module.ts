import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgeIdeModule } from '@mcisse/nge-ide';
import { NgeIdeExplorerModule } from '@mcisse/nge-ide/explorer';
import { NgeIdeSearchModule } from '@mcisse/nge-ide/search';
import { NgeIdeSettingsModule } from '@mcisse/nge-ide/settings';

import { NgeIdeProblemsModule } from '@mcisse/nge-ide/problems';
import { NgeIdeNotificationsModule } from '@mcisse/nge-ide/notifications';

import { ShowcaseComponent } from './showcase.component';


@NgModule({
    imports: [
        CommonModule,

        NgeIdeModule,
        NgeIdeExplorerModule,
        NgeIdeSearchModule,
        NgeIdeSettingsModule,

        NgeIdeProblemsModule,
        NgeIdeNotificationsModule,

        RouterModule.forChild([
            { path: '', component: ShowcaseComponent }
        ])
    ],
    declarations: [ShowcaseComponent],
    providers: [],
})
export class ShowcaseModule { }
