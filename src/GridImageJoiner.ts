import sharp from "sharp";
import type { Color, OverlayOptions } from "sharp";
import { ImageJoiner } from "./ImageJoiner";
import { FileLoader, Loader } from "./Loader";
import { assertExist } from "./utils";

export type DrawOptions = {
  resize?: {
    width: number;
    height: number;
  };
  row_gap?: number;
  col_gap?: number;
  background_color?: Color;
};

export interface GridItemOption {
  row: number;
  col: number;
  row_space?: number;
  col_space?: number;
}

export type ImageContent = string | Buffer

interface GridImageItem {
  image: ImageContent | Promise<ImageContent>;
  option: GridItemOption;
}

export class GridImageJoiner implements ImageJoiner {
  private images: Array<GridImageItem> = [];
  private grid_rows: number = 1;
  private grid_cols: number = 1;
  private loader: Loader = new FileLoader();

  constructor(grid_rows: number, grid_cols: number) {
    this.grid_rows = grid_rows;
    this.grid_cols = grid_cols;
  }

  private sizeCheck(options: GridItemOption) {
    const { row, col } = options;
    if (row >= this.grid_rows || col >= this.grid_cols) {
      throw new Error("row or col is out of range");
    }
  }

  private pushImage(image: GridImageItem, path?: string) {
    assertExist(image, path);
    this.sizeCheck(image.option);
    const { row_space = 1, col_space = 1 } = image.option;
    image.option = {
      ...image.option,
      row_space,
      col_space,
    };
    this.images.push(image);
  }

  loadImageFromLocal(path: string, options: GridItemOption) {
      const image = this.loader.loadFileAsync(path)
      this.pushImage({ image, option: options });
  }

  loadImageFromObj(image: string | Buffer, options: GridItemOption): void {
    this.pushImage({ image, option: options });
  }

  private async getImageSize(image: string | Buffer) {
    const image_ctx = sharp(image, { limitInputPixels: false });
    const meta_data = await image_ctx.metadata();
    return {
      width: meta_data.width,
      height: meta_data.height,
    };
  }

  async draw(options: DrawOptions = {}) {
    if (this.images.length === 0) {
      throw new Error("No images to draw.");
    }
    const {
      resize,
      row_gap = 0,
      col_gap = 0,
      background_color = { r: 0, g: 0, b: 0, alpha: 0 },
    } = options;

    let image_width: number, image_height: number;
    if (resize != null) {
      image_height = resize.height;
      image_width = resize.width;
    } else {
      const { height, width } = await this.getImageSize(await this.images[0].image);
      image_height = height;
      image_width = width;
    }

    const container_width =
      image_width * this.grid_cols + col_gap * (this.grid_cols - 1);
    const container_height =
      image_height * this.grid_rows + row_gap * (this.grid_rows - 1);

    const sharp_instance = await sharp({
      create: {
        width: container_width,
        height: container_height,
        channels: 4,
        background: background_color,
      },
      limitInputPixels: false,
      unlimited: true,
    });

    const ctx = sharp_instance.clone();
    const all_composite: unknown[] = [];
    const buffers: Array<Promise<OverlayOptions>> = this.images.map(
      async (image_item) => {
        const { image, option } = image_item;
        const { row, col, row_space, col_space } = option;

        const input_image = await sharp(await image, { limitInputPixels: false })
          .resize(image_width * col_space, image_height * row_space)
          .toBuffer();

        return {
          input: input_image,
          top: row * (image_height + row_gap),
          left: col * (image_width + col_gap),
        };
      }
    );

    ctx.composite(await Promise.all(buffers));
    await Promise.all(all_composite);
    return ctx;
  }
}
