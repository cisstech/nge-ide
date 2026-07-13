---
title: DividerComponent
description: A thin rule that separates content, laid out horizontally (default) or
---
# DividerComponent

`class`

A thin rule that separates content, laid out horizontally (default) or
vertically. Pure CSS, drop-in replacement for ng-zorro's `nz-divider`.

ng-zorro inputs are renamed to plain names: `nzDashed` becomes `dashed`, and
the `nzType="vertical"` variant becomes the boolean `vertical`.

The host carries `role="separator"` with a matching `aria-orientation` so it
is announced correctly, including when used between items of a menu.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `dashed (readonly)` | `InputSignalWithTransform<boolean, unknown>` | Draws the line with a dashed stroke instead of solid (replaces `nzDashed`). |
| `vertical (readonly)` | `InputSignalWithTransform<boolean, unknown>` | Orients the divider vertically for inline use (replaces `nzType="vertical"`). |
