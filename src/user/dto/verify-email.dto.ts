import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'polygon010101@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  code: string;
}
