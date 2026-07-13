---
title: IdeAutoOptionSelectionEvent
description: Payload emitted when an option is chosen.
---
# IdeAutoOptionSelectionEvent

`interface`

Payload emitted when an option is chosen.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `isUserInput (readonly)` | `boolean` | True when the selection came from a user gesture (click or Enter). |
| `source (readonly)` | `IdeAutoOptionComponent` | Option that was selected. |
