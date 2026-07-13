---
title: DndDirective
description: Element that can share or accept a data of dragged dom element.
---
# DndDirective

`class`

Element that can share or accept a data of dragged dom element.

- the class `dnd-over` is added to the element when a dragged data hover the element.
- the class `dnd-drag` is added to the element when the element is dragged.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `dndData?` | `string` | The data to share with the element |
| `dndTarget` | `number` |  |
| `draggable` | `boolean` | A value indicating whether the element can share a data or not |
| `droppable` | `boolean` | A value indicating whether a data can be dropped to this element |
| `dropped` | `EventEmitter<DndData>` | emits after a data is dropped. |
| `hovered` | `EventEmitter<boolean>` | emits after a data hover the element |

## `ngAfterContentInit()`

## Signature

```typescript
ngAfterContentInit(): void
```

### Returns

`void`
