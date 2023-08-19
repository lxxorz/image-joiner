import {readFile} from "node:fs/promises"
import {readFileSync} from "node:fs"
export interface Loader {
    loadFile?(path: string):string | Buffer
    loadFileAsync(path: string): Promise<string | Buffer>
}

export class FileLoader implements Loader {
    loadFile(path: string): string | Buffer {
        return readFileSync(path)
    }
    loadFileAsync(path: string) {
        return readFile(path)
    }    
}