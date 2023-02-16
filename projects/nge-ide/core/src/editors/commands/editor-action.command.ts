import { ICommand } from '../../commands';
import { MonacoService } from '../monaco.service';

export class EditorActionCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly label: string,
    readonly keybinding: string,
    private readonly monaco: MonacoService
  ) {}

  get enabled(): boolean {
    return !!this.monaco.activeEditor;
  }

  async execute(): Promise<void> {
    const activeEditor = this.monaco.activeEditor;
    if (activeEditor) {
      activeEditor.focus();
      activeEditor.trigger('code', this.id, null);
    }
  }

  static from(
    id: string,
    label: string,
    keybinding: string,
    monaco: MonacoService
  ) {
    return new EditorActionCommand(id, label, keybinding, monaco);
  }
}
