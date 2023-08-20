import { GridImageJoiner } from "../src/GridImageJoiner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

test("join image", async () => {
  const image_joiner = new GridImageJoiner(4, 3); // 4 rows, 4 columns

  for (let i = 0; i <= 3; ++i) {
    for (let j = 0; j <= 2; ++j) {
      const file_name = "./test/assets/images.jpg";
      await image_joiner.loadImageFromLocal(file_name, {
        row: i,
        col: j,
      });
    }
  }
  const image_ctx = await image_joiner.draw();
  const image_buffer = await image_ctx.toFormat("png").toBuffer();
  expect(image_buffer).toMatchImageSnapshot();
});

test("row gap and col gap", async () => {
  const image_joiner = new GridImageJoiner(4, 4); // 4 rows, 4 columns

  for (let i = 0; i <= 3; ++i) {
    for (let j = 0; j <= 3; ++j) {
      const file_name = "./test/assets/images.jpg";
      await image_joiner.loadImageFromLocal(file_name, {
        row: i,
        col: j,
      })
    }
  }
  const image_ctx = await image_joiner.draw({
    row_gap: 10,
    col_gap: 20,
  });
  /**
   * ImageSnapshot only supports the PNG format
   */
  const image_buffer = await image_ctx.toFormat("png").toBuffer();
  expect(image_buffer).toMatchImageSnapshot();
}, 250000);

test("background color", async () => {
  const image_joiner = new GridImageJoiner(4, 4); // 4 rows, 4 columns
  await image_joiner.loadImageFromLocal("./test/assets/images.jpg", {
    row: 0,
    col: 0,
  });
  const image_ctx = await image_joiner.draw({
    background_color: "red"
  });
  /**
   * ImageSnapshot only supports the PNG format
   */
  const image_buffer = await image_ctx.toFormat("png").toBuffer();
  expect(image_buffer).toMatchImageSnapshot();
}, 250000);

test("row-space & col-space", async () => {
  const image_joiner = new GridImageJoiner(4, 4); // 4 rows, 4 columns
  await image_joiner.loadImageFromLocal("./test/assets/images.jpg", {
    row: 0,
    col: 0,
    row_space: 2,
    col_space: 2,
  });
  const image_ctx = await image_joiner.draw({
    background_color: "red"
  });
  /**
   * ImageSnapshot only supports the PNG format
   */
  const image_buffer = await image_ctx.toFormat("png").toBuffer();
  expect(image_buffer).toMatchImageSnapshot();
}, 250000);

test("resize", async () => {
  const image_joiner = new GridImageJoiner(4, 4); // 4 rows, 4 columns
  await image_joiner.loadImageFromLocal("./test/assets/images.jpg", {
    row: 0,
    col: 0,
  });
  const image_ctx = await image_joiner.draw({
    resize: {
      width: 200,
      height: 100,
    }
  });
  /**
   * ImageSnapshot only supports the PNG format
   */
  const image_buffer = await image_ctx.toFormat("png").toBuffer();
  expect(image_buffer).toMatchImageSnapshot();
}, 250000);

test("clear", async () => {
  
  const image_joiner = new GridImageJoiner(4, 4); // 4 rows, 4 columns
  await image_joiner.loadImageFromLocal("./test/assets/images.jpg", {
    row: 0,
    col: 0,
  });
  const image_ctx = await image_joiner.draw();
  /**
   * ImageSnapshot only supports the PNG format
   */
  const image_buffer = await image_ctx.toFormat("png").toBuffer();
  expect(image_buffer).toMatchImageSnapshot();
  image_joiner.clear();
  await expect(() => image_joiner.draw()).rejects.toThrow();
})