---
title: TabComponent
description: A single tab hosted by TabsComponent. Standalone replacement for
---
# TabComponent

`class`

A single tab hosted by [TabsComponent](/docs/api/classes/TabsComponent). Standalone replacement for
ng-zorro's `nz-tab`.

The header is supplied through title (a plain string, or a
`TemplateRef` for rich content, renamed from `nzTitle`). The tab body is
projected through `<ng-content>` and rendered by the parent inside the active
tabpanel, so bodies are created lazily and only the selected one is shown.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `bodyTemplate (readonly)` | `Signal<TemplateRef<unknown> | undefined>` | Captured tab body, rendered by [TabsComponent](/docs/api/classes/TabsComponent) in the active tabpanel. |
| `tabClick (readonly)` | `OutputEmitterRef<void>` | Emits when the user activates the tab via mouse or keyboard (renamed from `nzClick`). |
| `title (readonly)` | `InputSignal<string | TemplateRef<unknown> | undefined>` | Header label: a plain string or a `TemplateRef` (renamed from `nzTitle`). |
