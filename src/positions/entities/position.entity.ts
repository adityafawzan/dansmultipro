// checked
import { ApiProperty } from '@nestjs/swagger';
import { Positions } from '@prisma/client';

export class Position implements Positions {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  is_full_time: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
