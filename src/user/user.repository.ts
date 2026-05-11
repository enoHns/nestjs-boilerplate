import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "../common/database/abstract.repository";
import { PrismaService } from "../common/database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity, CreateUserDto, UpdateUserDto> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(prisma: PrismaService) {
        super(prisma, 'user');
    }

    protected toEntity(raw: any): UserEntity {
        return new UserEntity(raw);
    }
}
