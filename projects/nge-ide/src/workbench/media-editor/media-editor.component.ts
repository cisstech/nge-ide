import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Editor, FileService, Paths } from '@cisstech/nge-ide/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ide-media-editor',
    templateUrl: 'media-editor.component.html',
    styleUrls: ['media-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaEditorComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    url?: string;
    type?: string;

    @Input()
    editor!: Editor;

    constructor(
        private readonly fileService: FileService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.subscriptions.push(
            this.editor.onChangeRequest.subscribe(request => {
                const file = this.fileService.find(request.uri);
                this.url = file?.url;
                switch (Paths.extname(request.uri.path)) {
                    case 'svg':
                    case 'png':
                    case 'jpeg':
                    case 'gif':
                    case 'tiff':
                        this.type = 'image';
                        break;
                    case 'mov':
                    case 'mp4':
                    case 'mpeg':
                        this.type = 'video';
                        break;
                    case 'mpeg':
                    case 'wav':
                    case 'mp3':
                        this.type = 'audio';
                        break;
                }
                this.changeDetectorRef.markForCheck();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
