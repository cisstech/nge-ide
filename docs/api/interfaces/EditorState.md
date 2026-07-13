---
title: EditorState
description: Represents the state of the editor.
---
# EditorState

`interface`

Represents the state of the editor.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `activeEditor? (readonly)` | `Editor` | Current active editor (the one focused in the `activeGroup` could be `null`). |
| `activeGroup? (readonly)` | `EditorGroup` | Current active editor group (the one focused in the workspace could be `null`) |
| `activeResource? (readonly)` | `Uri` | Current active resource (the one focused in explorer tree could be `null`). |
| `visibleEditors (readonly)` | `readonly Editor[]` | Current visible editors |
