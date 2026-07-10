import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import {
  BadgeComponent,
  CommandModule,
  OptionComponent,
  SelectComponent,
  TabComponent,
  TabsComponent,
  ViewModule,
} from '@cisstech/nge-ide/core'

import { InfobarComponent } from './infobar.component'

@NgModule({
  declarations: [InfobarComponent],
  imports: [
    CommonModule,
    FormsModule,
    TabsComponent,
    TabComponent,
    BadgeComponent,
    SelectComponent,
    OptionComponent,
    ViewModule,
    CommandModule,
  ],
  exports: [InfobarComponent],
})
export class InfobarModule {}
