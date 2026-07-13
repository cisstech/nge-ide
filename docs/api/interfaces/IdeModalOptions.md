---
title: IdeModalOptions
description: Options accepted by `IdeModalService.create`/`open`. Each field is the plain
---
# IdeModalOptions

`interface`

Options accepted by `IdeModalService.create`/`open`. Each field is the plain
rename of the matching `nz`-prefixed `NzModalService.create` option the IDE
relies on (`nzTitle` -> `title`, `nzContent` -> `content`, `nzFooter` ->
`footer`, `nzMaskClosable` -> `maskClosable`, and so on).

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `bodyStyle?` | `Record<string, string>` | Inline styles applied to the body wrapper. Replaces `nzBodyStyle`. |
| `centered?` | `boolean` | Vertically centers the modal. Replaces `nzCentered`. Defaults to `true`. |
| `closable?` | `boolean` | Whether the header shows a close (×) button. Replaces `nzClosable`. Defaults to `true`. |
| `componentParams?` | `Record<string, unknown>` | Inputs assigned to the content component when content is a component |
| `content?` | `string | Type<C>` | Body content: either a string (rendered as sanitized HTML) or a component |
| `footer?` | `IdeModalButton<C>[] | null` | Footer buttons, or `null` to hide the footer entirely. Replaces `nzFooter`. |
| `keyboard?` | `boolean` | Whether pressing `Escape` closes the modal. Replaces `nzKeyboard`. Defaults to `true`. |
| `mask?` | `boolean` | Whether a dimmed backdrop is rendered behind the modal. Replaces `nzMask`. Defaults to `true`. |
| `maskClosable?` | `boolean` | Whether clicking the backdrop closes the modal. Replaces `nzMaskClosable`. Defaults to `true`. |
| `modalType?` | `"default" | "confirm"` | Kept for parity with `nzModalType`; `'confirm'` exposes the `alertdialog` ARIA role. |
| `title?` | `string` | Header title text. Replaces `nzTitle`. |
| `width?` | `string | number` | Width of the modal; a number is treated as pixels. Replaces `nzWidth`. |
