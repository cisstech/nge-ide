import { Editor, OpenRequest, Paths } from '@cisstech/nge-ide/core'

const extensions = [
  'mp3',
  'wav',
  'ogg', // audio
  'mp4',
  'webm',
  'mov', // video
  'jpeg',
  'jpg',
  'gif',
  'png',
  'apng',
  'svg',
  'bmp',
  'bmp',
  'ico',
  'ico', // img
]

export class MediaEditor extends Editor {
  component = () => import('./media-editor.module').then((m) => m.MediaEditorModule)

  async canHandle(request: OpenRequest): Promise<boolean> {
    const { file } = request
    if (!file) return false

    const extension = Paths.extname(request.uri.path)
    return !!file?.url && extensions.includes(extension)
  }
}
