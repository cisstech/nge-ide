---
title: IFile
description: Representation of a file/directory.
---
# IFile

`interface`

Representation of a file/directory.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `isFolder (readonly)` | `boolean` | Is the file a directory? |
| `readOnly (readonly)` | `boolean` | Is the file readonly? |
| `uri (readonly)` | `Uri` | The associated uri for this file/directory. |
| `url? (readonly)` | `string` | Optional download url of the file. |
