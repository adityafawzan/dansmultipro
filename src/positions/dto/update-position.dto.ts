// checked
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ToBoolean } from 'src/decorators/toBoolean.decorator';

export class UpdatePositionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsBoolean()
  @ToBoolean()
  is_full_time: boolean;
}
