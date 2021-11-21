import { Component, OnInit } from '@angular/core';
import { FileService, MemFileProvider } from '@mcisse/nge-ide/core';
import { URI } from 'vscode-uri';

@Component({
    selector: 'app-showcase',
    templateUrl: 'showcase.component.html',
    styleUrls: ['showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {
    constructor(
        private readonly fileService: FileService
    ) { }

    ngOnInit() {
        this.fileService.registerProvider(new MemFileProvider());
        this.fileService.registerFolders({
            name: 'Home',
            uri: URI.parse('inmemory:///')
        })
    }
}
