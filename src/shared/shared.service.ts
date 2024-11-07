import path from 'path'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SharedService {
  public pathResolve(dir: string, basePath = process.cwd()): string {
    return path.normalize(path.resolve(basePath, dir))
  }
}
