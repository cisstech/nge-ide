import { NgModule } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { CommandService } from './commands';
import { CONTRIBUTION } from './contributions';
import { DiagnosticService } from './diagnostics';
import { EditorService, MonacoService, PreviewService } from './editors';
import { FileService } from './files';
import { IdeService } from './ide.service';
import { NotificationService } from './notification';
import { SettingsService } from './settings';
import { StatusBarService } from './status-bar';
import { StorageService } from './storage';
import { ToolbarSevice } from './toolbar';
import { ViewContainerService, ViewService } from './views';

@NgModule({
    providers: [
        IdeService,
        NgEventBus,
        FileService,
        ViewService,
        EditorService,
        MonacoService,
        ToolbarSevice,
        CommandService,
        StorageService,
        PreviewService,
        SettingsService,
        StatusBarService,
        DiagnosticService,
        NotificationService,
        ViewContainerService,

        { provide: CONTRIBUTION, multi: true, useExisting: FileService },
        { provide: CONTRIBUTION, multi: true, useExisting: ViewService },
        { provide: CONTRIBUTION, multi: true, useExisting: EditorService },
        { provide: CONTRIBUTION, multi: true, useExisting: MonacoService },
        { provide: CONTRIBUTION, multi: true, useExisting: ToolbarSevice },
        { provide: CONTRIBUTION, multi: true, useExisting: CommandService },
        { provide: CONTRIBUTION, multi: true, useExisting: PreviewService },
        { provide: CONTRIBUTION, multi: true, useExisting: SettingsService },
        { provide: CONTRIBUTION, multi: true, useExisting: StatusBarService },
        { provide: CONTRIBUTION, multi: true, useExisting: DiagnosticService },
        { provide: CONTRIBUTION, multi: true, useExisting: NotificationService },
        { provide: CONTRIBUTION, multi: true, useExisting: ViewContainerService },
    ],
})
export class CoreModule { }
