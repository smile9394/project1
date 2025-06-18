import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'title' })
  title: string;

  @ApiProperty({ example: 'description' })
  description: string;

  @ApiProperty({ example: 10000 })
  price: number;

  @ApiProperty({ example: 'category' })
  category: string;
}
