---
title: SkeletonComponent
description: Lightweight loading placeholder rendering a few content lines with an
---
# SkeletonComponent

`class`

Lightweight loading placeholder rendering a few content lines with an
optional shimmer. Drop-in replacement for `nz-skeleton`.

The host is marked `aria-hidden` because the placeholder is purely
decorative: loading state is meant to be announced once by the surrounding
view rather than repeated by every skeleton instance on screen.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `active (readonly)` | `InputSignalWithTransform<boolean, unknown>` | Enables the shimmer animation (replaces ng-zorro's `nzActive`). |
