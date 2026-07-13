---
title: TabsComponent
description: Card-style (or line-style) tab bar. Standalone replacement for ng-zorro's
---
# TabsComponent

`class`

Card-style (or line-style) tab bar. Standalone replacement for ng-zorro's
`nz-tabs`, hosting [TabComponent](/docs/api/classes/TabComponent) children.

- selectedIndex is two-way bindable (renamed from `nzSelectedIndex`).
- tabBarExtraContent renders a template at the trailing edge of the
  bar (renamed from `nzTabBarExtraContent`).
- Keyboard navigation follows the WAI-ARIA tabs pattern with `tablist` /
  `tab` / `tabpanel` roles: the CDK `FocusKeyManager` provides roving
  tabindex, Arrow-Left/Right move (and activate) tabs, and Home/End jump to
  the first/last tab.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `baseId (readonly)` | `string` | Stable prefix wiring each tab to its panel via `aria-controls` / `aria-labelledby`. |
| `selectedIndex (readonly)` | `ModelSignal<number>` | Zero-based index of the active tab (two-way, renamed from `nzSelectedIndex`). |
| `tabBarExtraContent (readonly)` | `InputSignal<TemplateRef<unknown> | undefined>` | Template rendered at the trailing edge of the bar (renamed from `nzTabBarExtraContent`). |
| `tabs (readonly)` | `Signal<readonly TabComponent[]>` | Tabs declared as content children. |
| `type (readonly)` | `InputSignal<IdeTabsType>` | Tab bar style (renamed from `nzType`). |

## `asTemplate()`

## Signature

```typescript
asTemplate(value: string | TemplateRef<unknown> | undefined): TemplateRef<unknown> | null
```

### Parameters

- `value` (`string | TemplateRef<unknown> | undefined`)

### Returns

`TemplateRef<unknown> | null`

## `ngAfterViewInit()`

## Signature

```typescript
ngAfterViewInit(): void
```

### Returns

`void`

## `ngOnDestroy()`

## Signature

```typescript
ngOnDestroy(): void
```

### Returns

`void`

## `onTabClick()`

## Signature

```typescript
onTabClick(index: number): void
```

### Parameters

- `index` (`number`)

### Returns

`void`

## `onTabListKeydown()`

## Signature

```typescript
onTabListKeydown(event: KeyboardEvent): void
```

### Parameters

- `event` (`KeyboardEvent`)

### Returns

`void`

## `panelId()`

## Signature

```typescript
panelId(index: number): string
```

### Parameters

- `index` (`number`)

### Returns

`string`

## `tabId()`

## Signature

```typescript
tabId(index: number): string
```

### Parameters

- `index` (`number`)

### Returns

`string`
