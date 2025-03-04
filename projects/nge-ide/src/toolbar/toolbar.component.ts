import { Component, DestroyRef, OnInit, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { IToolbarItem, ToolbarGroups, ToolbarService } from '@cisstech/nge-ide/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  selector: 'ide-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  private readonly toolbarService = inject(ToolbarService)

  protected menus: [string, Observable<IToolbarItem[]>][] = []
  protected buttons = this.toolbarService.listButtons()

  ngOnInit() {
    this.toolbarService
      .listCustomGroups()
      .pipe(
        map((customGroups) => {
          this.menus = []
          const titles: Record<ToolbarGroups, string> = {
            FILE: 'Fichier',
            EDIT: 'Modifier',
            SELECTION: 'Sélection',
            VIEW: 'Affichage',
            GO: 'Aller',
          }

          const groups = Object.keys(ToolbarGroups) as ToolbarGroups[]
          groups.forEach((group) => {
            this.menus.push([
              titles[group],
              this.toolbarService.listOfGroup(group).pipe(map((arr) => arr.sort((a, b) => a.priority - b.priority))),
            ])
          })

          customGroups.forEach((customGroup) => {
            const anchor = groups.indexOf(customGroup.anchor)
            if (anchor === -1) {
              return
            }

            this.menus.splice(anchor + (customGroup.position === 'before' ? 0 : 1), 0, [
              customGroup.name,
              this.toolbarService
                .listOfGroup(customGroup.name)
                .pipe(map((arr) => arr.sort((a, b) => a.priority - b.priority))),
            ])
          })
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }
}
