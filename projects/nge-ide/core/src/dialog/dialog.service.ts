import { Injectable, inject } from '@angular/core'
import { IdeModalService } from '../ui/dialog/ide-modal.service'
import { ConfirmOptions } from './dialog'

@Injectable()
export class DialogService {
  private readonly modalService = inject(IdeModalService)

  confirmAsync(options: ConfirmOptions): Promise<boolean | string> {
    return new Promise<boolean | string>((resolve) => {
      const modal = this.modalService.create<unknown, boolean | string>({
        title: options.title,
        content: options.message,
        closable: false,
        maskClosable: false,
        mask: true,
        centered: true,
        modalType: 'default',
        bodyStyle: {
          ...(!options.message && { display: 'none' }),
        },
        footer: [
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
