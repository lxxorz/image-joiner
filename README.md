# image-joiner 🖼️

Fast and Easy node.js Image join Tool.

## Install

```sh
pnpm add sharp image-joiner
```
## Features

- Based on grid layout
- Easy and fast ⚡

## Usage

```ts
import { GridImageJoiner } from 'image-joiner'

const joiner = new GridImageJoiner(2, 2)

joiner.loadImageFromLocal("./image.jpg", {
  row: 0,
  col: 0,
})

joiner.loadImageFromLocal("./image.jpg", {
  row: 1,
  col: 1,
})

joiner
  .draw({
    background_color: { r: 0, g: 122, b: 40, alpha: 0.2},
  })
  .then((image) => image.toFormat('png').toFile('output.png'))

```

## Load image from an existing image object

```ts
joiner.loadImageFromObj(image, options)
```

## Grid Item Options

You can specify the row_space and col_space of a grid item

```ts
export interface GridItemOption {
  row: number;
  col: number;
  row_space?: number; // default 1
  col_space?: number; // default 1
  order?: number; // default 1
}
```

## Draw Options

```ts
export type DrawOptions = {
  resize?: {
    width: number;
    height: number;
  };
  row_gap?: number;
  col_gap?: number;
  background_color?: Color;
}
```

![](examples/base.png)
