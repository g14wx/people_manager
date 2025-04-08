import { PrismaClient, Person as PrismaPersonPrisma } from '@prisma/client';
import { IPersonRepository, FindAllOptions } from '@/application/interfaces/IPersonRepository';
import { Person } from '@/domain/models/Person';
import { Status } from '@/domain/enums/Status.enum';
import { CreatePersonInput } from '@/application/dtos/person.dto';
import prisma from '../prisma';

function mapToDomain(prismaPerson: PrismaPersonPrisma): Person {
    return {
        ...prismaPerson,
        status: prismaPerson.status as Status,
    };
}

export class PrismaPersonRepository implements IPersonRepository {
    async create(data: CreatePersonInput): Promise<Person> {
        const newPerson = await prisma.person.create({
            data: {
                name: data.name,
                favoriteFood: data.favoriteFood,
                favoriteMovie: data.favoriteMovie,
                // Prisma enum type is used here directly from schema definition
                status: data.status,
            },
        });
        return mapToDomain(newPerson);
    }

    async findAll(options: FindAllOptions = {}): Promise<Person[]> {
        const { sortBy, sortOrder, status } = options;
        const persons = await prisma.person.findMany({
            where: {
                status: status ? status : undefined,
            },
            orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        });
        return persons.map(mapToDomain);
    }

    async findActive(options: Omit<FindAllOptions, 'status'> = {}): Promise<Person[]> {
        const { sortBy, sortOrder } = options;
        const persons = await prisma.person.findMany({
            where: {
                status: Status.Active,
            },
            orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        });
        return persons.map(mapToDomain);
    }

    async findById(id: string): Promise<Person | null> {
        const person = await prisma.person.findUnique({ where: { id } });
        return person ? mapToDomain(person) : null;
    }

    async findByName(name: string): Promise<Person | null> {
        const person = await prisma.person.findUnique({ where: { name } });
        return person ? mapToDomain(person) : null;
    }
}