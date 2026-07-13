---
title: SpinnerComponent
description: Indeterminate loading spinner. Standalone, pure-CSS replacement for
---
# SpinnerComponent

`class`

Indeterminate loading spinner. Standalone, pure-CSS replacement for
`nz-spin` when it is used purely as a busy indicator.

The rotation lives on an inner ring rather than on the host, so a
`transform` applied to the host by a consumer (for instance the `.center`
helper that overlays the spinner on the editor) is never clobbered by the
animation.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `size (readonly)` | `InputSignal<IdeSpinnerSize>` | Diameter of the spinner (replaces ng-zorro's `nzSize`). |
