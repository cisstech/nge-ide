import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EditorGroup, EditorService, EditorTab } from '@cisstech/nge-ide/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CodeEditor } from './code-editor/code-editor';
import { MediaEditor } from './media-editor/media-editor';
import { PreviewEditor } from './preview-editor/preview-editor';

@Component({
  selector: 'ide-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  readonly groups: Observable<EditorGroup[]> = this.editorService.editorGroups;
  readonly commands = combineLatest([
    this.editorService.commands.pipe(startWith([])),
    this.editorService.onDidOpen.pipe(startWith(undefined)), // reload commands every time an editor is opened
  ]).pipe(
    map(([commands, _]) => commands.slice()) // slice to force trigger change detection of command-group component
  );

  constructor(private readonly editorService: EditorService) {}

  ngOnInit(): void {
    this.editorService.registerEditors(
      new CodeEditor(),
      new MediaEditor(),
      new PreviewEditor()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  isActiveGroup(group: EditorGroup): boolean {
    return this.editorService.isActiveGroup(group);
  }

  setActiveGroup(group: EditorGroup): void {
    this.editorService.setActiveGroup(group);
  }

  trackTab(_: number, item: EditorTab) {
    return item.resource.toString(true);
  }

  trackGroup(_: number, item: EditorGroup) {
    return item.id;
  }
}
