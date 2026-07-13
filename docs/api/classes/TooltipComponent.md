---
title: TooltipComponent
description: The floating bubble rendered by TooltipDirective.
---
# TooltipComponent

`class`

The floating bubble rendered by [TooltipDirective](/docs/api/classes/TooltipDirective).

It is never placed in a template directly; the directive attaches it into a
CDK overlay as a `ComponentPortal`. The host carries `role="tooltip"` and a
unique `id` so the trigger element can point at it through `aria-describedby`.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `WritableSignal<string>` | DOM id referenced by the trigger's `aria-describedby`. |
| `text (readonly)` | `WritableSignal<string>` | Text shown inside the bubble. |
