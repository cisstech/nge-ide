import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';
import { CommandGroupComponent } from './command-group/command-group.component';

@NgModule({
    declarations: [
        CommandGroupComponent
    ],
    imports: [
        CommonModule,
        MatTooltipModule,
        NgeUiIconModule
    ],
    exports: [
        CommandGroupComponent
    ],
})
export class CommandModule { }
