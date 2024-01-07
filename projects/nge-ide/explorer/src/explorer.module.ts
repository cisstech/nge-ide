import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { CommandModule, EditorDirectivesModule } from '@cisstech/nge-ide/core';

import { IDynamicModule } from '@cisstech/nge/services';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree';

import { ExplorerComponent } from './explorer.component';
import { ExplorerFileIconOptionsPipe } from './pipes/explorer-file-icon-options.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzDropDownModule,
    CommandModule,
    NgeUiIconModule,
    NgeUiTreeModule,
    EditorDirectivesModule,
    ExplorerFileIconOptionsPipe
  ],
  declarations: [ExplorerComponent],
  exports: [ExplorerComponent]
})
export class ExplorerModule implements IDynamicModule {
  component = ExplorerComponent;
}
