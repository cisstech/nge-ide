import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'ide-preview-editor',
    templateUrl: './preview-editor.component.html',
    styleUrls: ['./preview-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewEditorComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
