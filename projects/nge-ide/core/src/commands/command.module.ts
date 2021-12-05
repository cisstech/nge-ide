import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgeUiIconModule } from '@mcisse/nge/ui/icon';
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
