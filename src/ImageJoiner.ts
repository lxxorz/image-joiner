export interface ImageJoiner {
  loadImageFromLocal(path: string, options?: unknown): void;
  loadImageFromObj(paths: string | Buffer, options?:unknown): void;
  draw();
}
