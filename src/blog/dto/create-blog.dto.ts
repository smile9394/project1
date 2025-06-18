import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 10000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;
  //데이터 무결성을 위한 클래스 벨리데이터
  @ApiProperty({ example: 'category' })
  @IsNotEmpty()
  @IsString()
  category: string;
}
