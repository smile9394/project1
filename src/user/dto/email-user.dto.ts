import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailUserDto {
  @ApiProperty({ example: 'polygon010101@gmail.com' })
  @IsEmail()
  email: string;
}
