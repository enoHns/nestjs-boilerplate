import { PrismaService } from "./prisma.service";
import { Logger, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "../pagination/pagination.dto";
import { PaginatedResult } from "../pagination/paginated-result";

type FilterCriteria = {
    [key: string]: any
}

type QueryOptions = {
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: Record<string, boolean>;
}

export abstract class AbstractRepository<Entity, CreateDto, UpdateDto> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly prisma: PrismaService, protected readonly model: keyof PrismaService) { }

    protected abstract toEntity(raw: any): Entity;

    private get repository(): any {
        return this.prisma[this.model];
    }

    async create(data: CreateDto): Promise<Entity> {
        const result = await this.repository.create({ data });
        return this.toEntity(result);
    }

    async update(criteria: FilterCriteria, data: Partial<Omit<UpdateDto, 'id'>>, options?: QueryOptions): Promise<Entity> {
        await this.findOne(criteria);
        const result = await this.repository.update({ where: criteria, data, ...options });
        return this.toEntity(result);
    }

    async delete(criteria: FilterCriteria, options?: QueryOptions): Promise<Entity> {
        await this.findOne(criteria);
        const result = await this.repository.delete({ where: { ...criteria }, ...options });
        return this.toEntity(result);
    }

    async findOne(criteria: FilterCriteria, options?: QueryOptions): Promise<Entity> {
        const item = await this.repository.findFirst({ where: { ...criteria }, ...options });
        if (!item) {
            this.logger.warn(`Item not found with criteria`, criteria);
            throw new NotFoundException('Database item not found');
        }
        return this.toEntity(item);
    }

    async findUnique(criteria: FilterCriteria, options?: QueryOptions): Promise<Entity | null> {
        const item = await this.repository.findUnique({ where: { ...criteria }, ...options });
        return item ? this.toEntity(item) : null;
    }

    async findMany(criteria: FilterCriteria, options?: QueryOptions): Promise<Entity[]> {
        const items = await this.repository.findMany({ where: { ...criteria }, ...options });
        return items.map((i: any) => this.toEntity(i));
    }

    async findManyPaginated(criteria: FilterCriteria, pagination: PaginationDto, options?: QueryOptions): Promise<PaginatedResult<Entity>> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.repository.findMany({ where: { ...criteria }, skip, take: limit, ...options }),
            this.repository.count({ where: { ...criteria } }),
        ]);
        return new PaginatedResult(items.map((i: any) => this.toEntity(i)), total, page, limit);
    }
}

