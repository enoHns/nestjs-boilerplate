import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

