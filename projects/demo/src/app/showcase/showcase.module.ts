import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgeIdeModule } from '@cisstech/nge-ide';
import { NgeIdeExplorerModule } from '@cisstech/nge-ide/explorer';
import { NgeIdeSearchModule } from '@cisstech/nge-ide/search';
import { NgeIdeSettingsModule } from '@cisstech/nge-ide/settings';

import { NgeIdeProblemsModule } from '@cisstech/nge-ide/problems';
import { NgeIdeNotificationsModule } from '@cisstech/nge-ide/notifications';

import { ShowcaseComponent } from './showcase.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,

    NgeIdeModule,
    NgeIdeExplorerModule,
    NgeIdeSearchModule,
    NgeIdeSettingsModule,

    NgeIdeProblemsModule,
    NgeIdeNotificationsModule,
    MatTooltipModule,

    RouterModule.forChild([{ path: '', component: ShowcaseComponent }]),
  ],
  declarations: [ShowcaseComponent],
  providers: [],
})
export class ShowcaseModule {}
