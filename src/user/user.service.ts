import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginatedResult } from '../common/pagination/paginated-result';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findUnique({ email: dto.email });
    if (existUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.userRepository.create({ ...dto, password: hashedPassword });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findMany({});
  }

  async findAllPaginated(pagination: PaginationDto): Promise<PaginatedResult<UserEntity>> {
    return this.userRepository.findManyPaginated({}, pagination);
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
  }
}

