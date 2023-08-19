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

### Create grid container

```ts
 import {GridImageJoiner} from "image-joiner"
 const joiner = gridImageJoiner(4,4)
```

### Add image to container

> note: **Must** wait for images to finish loading before calling draw()

```ts
await joiner.loadImageFromLocal(file_name, {
      row: i,
      col: j,
    })
```

### draw

 ```ts
 const image = joiner.draw()
 ```

### Output

**examples**: save as png file

```ts
const image = joiner.draw()
image.toFormat("png").toFile("output.png")
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

## Result

![](examples/gap.png)


