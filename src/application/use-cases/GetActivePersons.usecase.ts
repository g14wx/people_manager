import {FindAllOptions, IPersonRepository} from '../interfaces/IPersonRepository';
import {ActivePersonOutput} from '../dtos/person.dto';

export class GetActivePersonsUseCase {
    constructor(private personRepository: IPersonRepository) {}

    async execute(options?: Omit<FindAllOptions, 'status'>): Promise<ActivePersonOutput[]> {
        const activePersons = await this.personRepository.findActive(options);

        const retrievedAt = new Date();

        return activePersons.map(person => ({
            name: person.name,
            favoriteMovie: person.favoriteMovie,
            retrievedAt: retrievedAt,
        }));
    }
}