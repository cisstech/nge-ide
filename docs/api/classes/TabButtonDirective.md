---
title: TabButtonDirective
description: Internal directive applied to every tab header rendered by
---
# TabButtonDirective

`class`

Internal directive applied to every tab header rendered by
[TabsComponent](/docs/api/classes/TabsComponent).

It exposes each header as a CDK FocusableOption so a `FocusKeyManager`
can drive roving-tabindex keyboard navigation across the `tablist`. It is an
implementation detail of the tabs component and is not part of the public API.

## `focus()`

## Signature

```typescript
focus(): void
```

### Returns

`void`
