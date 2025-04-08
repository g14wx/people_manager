import { Person } from '@/domain/models/Person';
import { Status } from '@/domain/enums/Status.enum';
import { CreatePersonInput } from '../dtos/person.dto';

export interface FindAllOptions {
    sortBy?: keyof Person;
    sortOrder?: 'asc' | 'desc';
    status?: Status;
}

export interface IPersonRepository {
    create(data: CreatePersonInput): Promise<Person>;
    findAll(options?: FindAllOptions): Promise<Person[]>;
    findActive(options?: Omit<FindAllOptions, 'status'>): Promise<Person[]>;
    findById(id: string): Promise<Person | null>;
    findByName(name: string): Promise<Person | null>;
}