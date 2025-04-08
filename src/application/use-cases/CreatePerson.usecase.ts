import {IPersonRepository} from '../interfaces/IPersonRepository';
import {Person} from '@/domain/models/Person';
import {CreatePersonInput} from '../dtos/person.dto';

export class CreatePersonUseCase {
    constructor(private personRepository: IPersonRepository) {}

    async execute(input: CreatePersonInput): Promise<Person> {
        const existing = await this.personRepository.findByName(input.name);
        if (existing) {
            throw new Error(`Person with name "${input.name}" already exists.`);
        }
        // Call repository to persist data
        return await this.personRepository.create(input);
    }
}