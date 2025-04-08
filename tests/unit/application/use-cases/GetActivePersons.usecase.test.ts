import { GetActivePersonsUseCase } from '@/application/use-cases/GetActivePersons.usecase';
import { IPersonRepository } from '@/application/interfaces/IPersonRepository';
import { Person } from '@/domain/models/Person';
import { Status } from '@/domain/enums/Status.enum';

const mockPersonRepository: jest.Mocked<IPersonRepository> = {
    findActive: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
};

describe('GetActivePersonsUseCase', () => {
    let getActivePersonsUseCase: GetActivePersonsUseCase;

    beforeEach(() => {
        jest.resetAllMocks();
        getActivePersonsUseCase = new GetActivePersonsUseCase(mockPersonRepository);
    });

    it('should return only active persons with retrieval date', async () => {
        const mockActivePersons: Person[] = [
            { id: '1', name: 'Matt', favoriteFood: 'Tacos', favoriteMovie: 'Princess Bride', status: Status.Active, createdAt: new Date(), updatedAt: new Date() },
            { id: '2', name: 'Miro', favoriteFood: 'Sushi', favoriteMovie: 'American Psycho', status: Status.Active, createdAt: new Date(), updatedAt: new Date() },
        ];
        mockPersonRepository.findActive.mockResolvedValue(mockActivePersons);

        const result = await getActivePersonsUseCase.execute();
        const now = new Date();

        expect(mockPersonRepository.findActive).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('name', 'Matt');
        expect(result[0]).toHaveProperty('favoriteMovie', 'Princess Bride');
        expect(result[0]).toHaveProperty('retrievedAt');
        expect(result[0].retrievedAt.getTime()).toBeCloseTo(now.getTime(), -3);
        expect(result[1]).toHaveProperty('name', 'Miro');
        expect(result[1].retrievedAt.getTime()).toBeCloseTo(now.getTime(), -3);

    });

    it('should return an empty array if no active persons are found', async () => {
        mockPersonRepository.findActive.mockResolvedValue([]);

        const result = await getActivePersonsUseCase.execute();

        expect(mockPersonRepository.findActive).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });

    it('should pass sorting options to the repository', async () => {
        mockPersonRepository.findActive.mockResolvedValue([]);

        const options = { sortBy: 'name', sortOrder: 'desc' } as const;
        await getActivePersonsUseCase.execute(options);

        expect(mockPersonRepository.findActive).toHaveBeenCalledWith(options);
    });
});