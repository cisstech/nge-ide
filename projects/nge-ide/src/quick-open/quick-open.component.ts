import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnInit
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  CommandService,
  EditorService,
  FileService,
  ICommand,
  IFile,
  Keybinding,
  KeyCodes,
  KeyModifiers,
  Paths,
  ToolbarButton,
  ToolbarGroups,
  ToolbarSevice
} from '@cisstech/nge-ide/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'ide-quick-open',
  templateUrl: './quick-open.component.html',
  styleUrls: ['./quick-open.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickOpenComponent implements OnInit {
  private readonly command = new (class implements ICommand {
    readonly id = 'editor.commands.quick-open';
    readonly label = 'Aller au fichier..';
    readonly enabled = true;
    readonly keybinding = new Keybinding({
      key: KeyCodes.O,
      label: '⌘ O',
      modifiers: [KeyModifiers.CTRL_CMD],
    });

    constructor(private readonly component: QuickOpenComponent) { }

    execute() {
      this.component.show();
    }
  })(this);

  readonly form = new UntypedFormControl();
  readonly $entries: Observable<IFile[]> = this.form.valueChanges.pipe(
    debounceTime(100),
    map((query) => this.filter(query).slice(0, 10))
  );

  protected data: IFile[] = [];
  protected visible = false;

  get isVisible(): boolean {
    return this.visible;
  }

  constructor(
    private readonly fileService: FileService,
    private readonly editorService: EditorService,
    private readonly toolbarService: ToolbarSevice,
    private readonly commandService: CommandService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.commandService.register(this.command);
    this.toolbarService.register(
      new ToolbarButton({
        group: ToolbarGroups.GO,
        priority: 10,
        command: this.command,
      })
    );
  }

  protected onBlured() {
   setTimeout(() => {
    this.hide();
   }, 300) // allow onSelected to be called.
  }

  protected onSelected(file: IFile) {
    this.editorService.open(file.uri);
    this.hide();
  }

  protected filterByUri(_: number, file: IFile) {
    return file.uri.path;
  }

  private filter(query: string): IFile[] {
    query = (query || '').toLowerCase();
    if (!query) {
      return this.data;
    }
    return this.data.filter((item) => {
      return Paths.basename(item.uri.path).toLowerCase().includes(query);
    });
  }

  private hide(): void {
    this.form.setValue('');
    this.data = [];
    this.visible = false;
    this.changeDetectorRef.markForCheck();
  }

  private show(): void {
    this.visible = true;
    this.form.setValue('');
    this.data = this.fileService.findAll((file) => !file.isFolder);
    this.changeDetectorRef.markForCheck();
  }
}
