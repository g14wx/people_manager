import { Person as PrismaPerson } from '@prisma/client';
import { Status } from '../enums/Status.enum';

export interface Person extends Omit<PrismaPerson, 'status'> {
    status: Status;
}