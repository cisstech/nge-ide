import { Component, OnInit } from '@angular/core';
import { IToolbarItem, ToolbarGroups, ToolbarSevice } from '@mcisse/nge-ide/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
    selector: 'ide-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
    readonly menus: [string, Observable<IToolbarItem[]>][] = [];

    constructor(
        private readonly toolbarService: ToolbarSevice
    ) { }

    ngOnInit() {
        const titles: Record<ToolbarGroups, string> = {
            'FILE': 'Fichier',
            'EDIT': 'Modifier',
            'SELECTION': 'Sélection',
            'VIEW': 'Affichage',
            'GO': 'Aller',
        };
        Object.values(ToolbarGroups).forEach(group => {
            this.menus.push([
                titles[group],
                this.toolbarService.listOfGroup(group).pipe(
                    map(arr => arr.sort((a, b) => a.priority - b.priority))
                )
            ]);
        });
    }
}
