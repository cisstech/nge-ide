
// https://github.com/microsoft/vscode/blob/e531b8e963806dfadbd73b10c02785c75ffb8cab/src/vs/editor/contrib/dropIntoEditor/browser/dropIntoEditorContribution.ts#L48

import { DndDataTransfer } from "../../directives";
import { EditorService } from "../editor.service";

type IPosition = monaco.IPosition;
type IRange = monaco.IRange;
type IContentWidget = monaco.editor.IContentWidget;
type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

const ID = 'drop-controller-widget'

type Handler = string | {
  /**
   * The label of the handler that will be shown in the editor.
   */
  label: string
  /**
   * The value that will be inserted into the editor.
   */
  value: string
}

/**
 * A handler function that will be called when file is dropped into editor from the file explorer.
 * @param uri The uri of the file that was dropped.
 * @param editor The editor instance.
 * @param position The position in the editor where the file was dropped.
 * @returns An array of strings that will be inserted into the editor or undefined if no insertion should happen.
 */
export type DropIntoEditorHandler = (
  uri: monaco.Uri,
  editor: IStandaloneCodeEditor,
  position: IPosition,
) => Handler[] | Promise<Handler[]>;

export class DropIntoEditorController {
  private dropController!: any;
  private onDropIntoEditorBase!: (editor: IStandaloneCodeEditor, position: IPosition, dragEvent: DragEvent) => Promise<unknown>;

  constructor(editor: monaco.editor.IStandaloneCodeEditor, private readonly editorService: EditorService) {
    const dropController = editor.getContribution('editor.contrib.dropIntoEditorController') as any;
    if (!dropController) {
      console.warn('dropController not found')
      return
    }

    const onDropIntoEditorBase = dropController.onDropIntoEditor
    if (!onDropIntoEditorBase) {
      console.warn('onDropIntoEditorBase not found')
      return
    }

    this.dropController = dropController
    this.onDropIntoEditorBase = onDropIntoEditorBase

    dropController.onDropIntoEditor = this.onDropIntoEditor.bind(this)
  }

  private async onDropIntoEditor(editor: IStandaloneCodeEditor, position: IPosition, dragEvent: DragEvent): Promise<unknown> {
    const { dataTransfer } = dragEvent
    const insert = dataTransfer?.getData(DndDataTransfer)
    if (!insert) {
      return this.onDropIntoEditorBase.call(this.dropController, editor, position, dragEvent)
    }

    const uri = monaco.Uri.parse(insert)
    if (!uri) {
      return this.onDropIntoEditorBase.call(this.dropController, editor, position, dragEvent)
    }

    const handlers = this.editorService.dropHandlers;
    if (!handlers.length) {
      return this.onDropIntoEditorBase.call(this.dropController, editor, position, dragEvent)
    }


    const results = (await Promise.all(
      handlers.map(handler => handler(uri, editor, position))
    ))

    const insertOptions: (readonly [string, string])[] = []
    results.forEach(result => {
      if (result) {
        insertOptions.push(
          ...result
            .filter(Boolean)
            .map(handler => typeof handler === 'string' ? [handler, handler] as const: [handler.label, handler.value] as const))
      }
    })

    if (!insertOptions.length) {
      return // onDropIntoEditoBase cannot be called here because of the async nature of the handlers above
    }

    editor.setPosition(position)
    const widget: IContentWidget = {
      getId: () => ID,
      allowEditorOverflow: true,
      suppressMouseDown: true,
      getDomNode: () => {
        const node = document.createElement('div');
        node.classList.add(ID)

        const removeIfClickedOutside = (e: MouseEvent) => {
          if (!node.contains(e.target as Node)) {
            editor.removeContentWidget(widget)
            document.removeEventListener('click', removeIfClickedOutside)
          }
        }
        document.addEventListener('click', removeIfClickedOutside)


        insertOptions.forEach(tuple => {
          const button = document.createElement('div')
          button.textContent = tuple[0]
          button.onclick = () => {
            const range: IRange = {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            }
            editor.executeEdits('api', [{ range, text: tuple[1], forceMoveMarkers: true, }])

            setTimeout(() => {
              editor.setPosition({ lineNumber: position.lineNumber, column: position.column + tuple[1].length })
              editor.focus()
            })
            editor.removeContentWidget(widget)
          }
          node.appendChild(button)
        })

        return node;
      },
      getPosition: () => {
        return {
          position,
          preference: [monaco.editor.ContentWidgetPositionPreference.BELOW, monaco.editor.ContentWidgetPositionPreference.EXACT],
        };
      },
    }

    editor.addContentWidget(widget)
  }
}
