import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FileService,
  IdeService,
  MemFileProvider,
} from '@cisstech/nge-ide/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-showcase',
  templateUrl: 'showcase.component.html',
  styleUrls: ['showcase.component.scss'],
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private readonly ide: IdeService,
    private readonly fileService: FileService
  ) {}

  ngOnInit() {
    this.subscription = this.ide.onAfterStart(() => {
      const provider = new MemFileProvider();
      this.fileService.registerProvider(provider);
      provider.roots.forEach((root) => {
        this.fileService.registerFolders({
          name: root.authority,
          uri: root,
        });
      })
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
