import { Injectable } from '@angular/core'
import { ICommand } from '@cisstech/nge-ide/core'
import { CodIcon } from '@cisstech/nge/ui/icon'
import { ExplorerService } from '../../explorer.service'

export const EXPLORER_COMMAND_COLLAPSE = 'explorer.commands.collapse-all'

@Injectable()
export class ExplorerCommandCollapseAll implements ICommand {
  readonly id = EXPLORER_COMMAND_COLLAPSE
  readonly icon = new CodIcon('collapse-all')
  readonly label = 'Réduire les dossiers'
  readonly enabled = true

  constructor(private readonly explorerService: ExplorerService) {}

  execute() {
    this.explorerService.collapseAll()
  }
}
