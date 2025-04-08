import {FindAllOptions, IPersonRepository} from '../interfaces/IPersonRepository';
import {Person} from '@/domain/models/Person';

export class GetAllPersonsUseCase {
    constructor(private personRepository: IPersonRepository) {}

    async execute(options?: FindAllOptions): Promise<Person[]> {
        return await this.personRepository.findAll(options);
    }
}