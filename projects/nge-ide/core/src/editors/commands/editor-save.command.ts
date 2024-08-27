import { Injectable } from '@angular/core'
import { CodIcon } from '@cisstech/nge/ui/icon'
import { ICommand, Keybinding } from '../../commands'
import { KeyCodes, KeyModifiers } from '../../keybinding/index'
import { EditorService } from '../editor.service'

export const EDITOR_SAVE_COMMAND = 'editor.commands.save'

@Injectable()
export class EditorSaveCommand implements ICommand {
  readonly id = EDITOR_SAVE_COMMAND
  readonly icon = new CodIcon('save')
  readonly label = 'Enregistrer'
  readonly keybinding = new Keybinding({
    key: KeyCodes.S,
    label: '⌘ S',
    modifiers: [KeyModifiers.CTRL_CMD],
  })

  get enabled(): boolean {
    return !!this.editorService.activeResource
  }

  constructor(private readonly editorService: EditorService) {}

  execute() {
    this.editorService.saveActiveResource()
  }
}
