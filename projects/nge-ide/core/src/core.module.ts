import { NgModule } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { CommandService } from './commands';
import { CONTRIBUTION } from './contributions';
import { DiagnosticService } from './diagnostics';
import { MonacoService, EditorService } from './editors';
import { FileService } from './files';
import { IdeService } from './ide.service';
import { NotificationService } from './notification';
import { StatusBarService } from './status-bar';
import { StorageService } from './storage';
import { ViewContainerService, ViewService } from './views';


@NgModule({
    providers: [
        IdeService,
        NgEventBus,
        FileService,
        ViewService,
        EditorService,
        CommandService,
        StatusBarService,
        DiagnosticService,
        MonacoService,
        StorageService,
        NotificationService,
        ViewContainerService,

        { provide: CONTRIBUTION, multi: true, useExisting: ViewService },
        { provide: CONTRIBUTION, multi: true, useExisting: CommandService },
        { provide: CONTRIBUTION, multi: true, useExisting: FileService },
        { provide: CONTRIBUTION, multi: true, useExisting: EditorService },
        { provide: CONTRIBUTION, multi: true, useExisting: MonacoService },
        { provide: CONTRIBUTION, multi: true, useExisting: ViewContainerService },
    ],
})
export class CoreModule { }
