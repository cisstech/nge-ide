import { Injectable } from '@angular/core'
import { CodIcon } from '@cisstech/nge/ui/icon'
import { ICommand, Keybinding } from '../../commands'
import { KeyCodes, KeyModifiers } from '../../keybinding'
import { EditorService } from '../editor.service'

export const EDITOR_CLOSE_COMMAND = 'editor.commands.close'

@Injectable()
export class EditorCloseCommand implements ICommand {
  readonly id = EDITOR_CLOSE_COMMAND
  readonly icon = new CodIcon('close')
  readonly label = 'Fermer'
  readonly keybinding = new Keybinding({
    key: KeyCodes.W,
    label: '⌘ W',
    modifiers: [KeyModifiers.CTRL_CMD],
  })

  constructor(private readonly editorService: EditorService) {}

  get enabled(): boolean {
    return !!this.editorService.activeResource
  }

  async execute(): Promise<void> {
    if (this.editorService.activeResource) {
      this.editorService.close(this.editorService.activeResource)
    }
  }
}
