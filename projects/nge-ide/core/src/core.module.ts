import { NgModule } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { CommandService } from './commands/index';
import { CONTRIBUTION } from './contributions/index';
import { DiagnosticService } from './diagnostics/index';
import { EditorService, MonacoService, PreviewService } from './editors/index';
import { FileService } from './files/index';
import { IdeService } from './ide.service';
import { NotificationService } from './notifications/index';
import { SettingsService } from './settings/index';
import { StatusBarService } from './status-bar/index';
import { StorageService } from './storage/index';
import { TaskService } from './tasks/index';
import { ToolbarSevice } from './toolbar/index';
import { ViewContainerService, ViewService } from './views/index';
import { DialogModule } from './dialog';

@NgModule({
  imports: [
    DialogModule
  ],
  providers: [
    IdeService,
    NgEventBus,
    FileService,
    ViewService,
    TaskService,
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
    { provide: CONTRIBUTION, multi: true, useExisting: TaskService },
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
export class CoreModule {}
