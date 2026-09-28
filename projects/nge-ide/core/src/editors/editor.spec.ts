/// <reference types="monaco-editor/monaco" />
import { Injector } from '@angular/core'
import { Editor, EditorGroup } from './editor'
import { OpenOptions, OpenRequest } from './opener'
import { Preview } from './preview'

class AnyEditor extends Editor {
  readonly component = () => class {}

  canHandle(_: OpenRequest): boolean {
    return true
  }
}

const uri = (path: string) =>
  ({
    scheme: 'file',
    path,
    toString: () => `file://${path}`,
  }) as unknown as monaco.Uri

const asEditor: OpenOptions = { title: 'file', tooltip: 'file' }
const asPreview: OpenOptions = { ...asEditor, preview: {} as Preview }

describe('EditorGroup', () => {
  let closeGuard: jest.Mock<Promise<boolean>>
  let group: EditorGroup

  beforeEach(() => {
    const fileService = { hasProvider: () => false }
    const injector = { get: () => fileService } as unknown as Injector
    closeGuard = jest.fn(async () => true)
    group = new EditorGroup(injector, jest.fn(), jest.fn(), closeGuard, [new AnyEditor()])
  })

  it('opens an editor and a preview of the same resource as two tabs', async () => {
    await group.open(uri('/a.md'), asEditor)
    await group.open(uri('/a.md'), asPreview)

    expect(group.tabs.map((tab) => tab.kind)).toEqual(['editor', 'preview'])
    expect(group.activeTab?.kind).toBe('preview')

    await group.open(uri('/a.md'), asEditor)
    expect(group.tabs.length).toBe(2)
    expect(group.activeTab?.kind).toBe('editor')
  })

  it('closes only the given tab', async () => {
    await group.open(uri('/a.md'), asEditor)
    await group.open(uri('/a.md'), asPreview)

    await group.closeTab(group.findTab(uri('/a.md'), 'preview')!)

    expect(group.tabs.map((tab) => tab.kind)).toEqual(['editor'])
    expect(group.activeTab?.kind).toBe('editor')
  })

  it('closes every tab of a resource', async () => {
    await group.open(uri('/a.md'), asEditor)
    await group.open(uri('/a.md'), asPreview)
    await group.open(uri('/b.md'), asEditor)

    expect(await group.close(uri('/a.md'))).toBe(true)

    expect(group.tabs.map((tab) => tab.resource.path)).toEqual(['/b.md'])
  })

  it('only guards the editor tab against unsaved changes', async () => {
    await group.open(uri('/a.md'), asEditor)
    await group.open(uri('/a.md'), asPreview)
    closeGuard.mockResolvedValue(false)

    expect(await group.closeTab(group.findTab(uri('/a.md'), 'preview')!)).toBe(true)
    expect(await group.closeTab(group.findTab(uri('/a.md'), 'editor')!)).toBe(false)
    expect(closeGuard).toHaveBeenCalledTimes(1)
  })

  it('keeps the active tab when a tab before it is closed', async () => {
    await group.open(uri('/a.md'), asEditor)
    await group.open(uri('/b.md'), asEditor)
    await group.open(uri('/c.md'), asEditor)

    await group.closeTab(group.findTab(uri('/a.md'))!)

    expect(group.activeTab?.resource.path).toBe('/c.md')
  })
})
