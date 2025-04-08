import { PrismaClient, Status as PrismaStatus } from '@prisma/client';

const prisma = new PrismaClient();

const initialPeople = [
    {
        name: 'Rocky',
        favoriteFood: 'Sushi',
        favoriteMovie: 'Back to The Future',
        status: PrismaStatus.Inactive,
    },
    {
        name: 'Miroslav',
        favoriteFood: 'Sushi',
        favoriteMovie: 'American Psycho',
        status: PrismaStatus.Active,
    },
    {
        name: 'Donny',
        favoriteFood: 'Singapore chow mei fun',
        favoriteMovie: 'The Princess Bride',
        status: PrismaStatus.Inactive,
    },
    {
        name: 'Matt',
        favoriteFood: 'Brisket Tacos',
        favoriteMovie: 'The Princess Bride',
        status: PrismaStatus.Active,
    },
    {
        name: 'Your Name',
        favoriteFood: 'Pizza',
        favoriteMovie: 'Inception',
        status: PrismaStatus.Active,
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (const personData of initialPeople) {
        try {
            const person = await prisma.person.upsert({
                where: { name: personData.name },
                update: {},
                create: personData,
            });
            console.log(`Created or found person with id: ${person.id} (Name: ${person.name})`);
        } catch (error) {
            console.error(`Error seeding person ${personData.name}:`, error);
        }
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });