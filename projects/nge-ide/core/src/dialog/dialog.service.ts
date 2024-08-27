import { Injectable, inject } from '@angular/core'
import { NzModalService } from 'ng-zorro-antd/modal'
import { ConfirmOptions } from './dialog'

@Injectable()
export class DialogService {
  private readonly nzModalService = inject(NzModalService)

  confirmAsync(options: ConfirmOptions): Promise<boolean | string> {
    return new Promise<boolean | string>((resolve) => {
      const modal = this.nzModalService.create({
        nzTitle: options.title,
        nzContent: options.message,
        nzClosable: false,
        nzMaskClosable: false,
        nzMask: true,
        nzCentered: true,
        nzModalType: 'default',
        nzBodyStyle: {
          ...(!options.message && { display: 'none' }),
        },
        nzFooter: [
          ...(options.buttons?.map((button) => ({
            label: button.title,
            danger: button.danger ?? false,
            onClick: () => {
              resolve(button.id)
              modal.close()
            },
          })) ?? []),
          {
            label: options.noTitle ?? 'Annuler',
            onClick: () => {
              resolve(false)
              modal.close()
            },
          },
          {
            label: options.okTitle ?? 'Confirmer',
            type: 'primary',
            danger: options.danger ?? false,
            onClick: () => {
              resolve(true)
              modal.close()
            },
          },
        ],
      })
    })
  }
}
