import { Injectable } from '@nestjs/common'

@Injectable()
export class ToolService {
  randomUUID() {
    return crypto.randomUUID()
  }
}
