import { ApiPropertyOptional } from '@nestjs/swagger'

export class TableQueryDto {
  @ApiPropertyOptional({ type: 'integer', default: 10, description: '当前页条目数' })
  take: number

  @ApiPropertyOptional({ type: 'integer', default: 10, description: '当前页条目数' })
  skip: number
}
