import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { IdeService } from '@mcisse/nge-ide/core';

@Component({
    selector: 'ide-root',
    templateUrl: 'ide.component.html',
    styleUrls: ['ide.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeComponent implements OnInit, OnDestroy {
    constructor(private readonly ide: IdeService) { }

    async ngOnInit(): Promise<void> {
        await this.ide.start();
    }

    async ngOnDestroy(): Promise<void> {
        await this.ide.stop();
    }
}
