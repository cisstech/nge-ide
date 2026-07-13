---
title: OptionComponent
description: A single choice inside an SelectComponent (`ide-select`).
---
# OptionComponent

`class`

A single choice inside an [SelectComponent](/docs/api/classes/SelectComponent) (`ide-select`).

Replaces ng-zorro's `nz-option`. It is a lightweight, non-visual declaration:
`ide-select` reads its value and label through a content query
and renders the actual keyboard-accessible option row itself (inside the
dropdown overlay). The `[nzValue]` / `[nzLabel]` inputs become plain
`value` / `label`.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `displayLabel (readonly)` | `Signal<string>` | Display text: the explicit label, falling back to the value when unset. |
| `label (readonly)` | `InputSignal<string | undefined>` | Text shown for this option in the trigger and the dropdown. |
| `value (readonly)` | `InputSignal<unknown>` | Value bound to the form control when this option is selected. |
