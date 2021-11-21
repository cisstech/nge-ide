import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IDynamicModule } from '@mcisse/nge/services';
import { SettingsComponent } from './settings.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        SettingsComponent,
    ],
})
export class SettingsModule implements IDynamicModule {
    component = SettingsComponent
}
