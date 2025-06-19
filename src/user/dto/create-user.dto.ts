import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUrl,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'sungwoo123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'smile.sungwoo@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '010-1234-5678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^01[016789]-?\d{3,4}-?\d{4}$/, {
    message: 'Phone number must be a valid Korean mobile number',
  })
  phone: string;

  @ApiProperty({ example: 'https://sungwoo.com' })
  @IsUrl()
  @IsNotEmpty()
  profileImg: string;
}
