import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Editor, Preview } from '@cisstech/nge-ide/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ide-preview-editor',
    templateUrl: './preview-editor.component.html',
    styleUrls: ['./preview-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewEditorComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    @Input()
    editor!: Editor;
    preview?: Preview;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
          this.subscriptions.push(
            this.editor.onChangeRequest.subscribe(request => {
                this.preview = request.options?.preview;
                this.changeDetectorRef.markForCheck();
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
