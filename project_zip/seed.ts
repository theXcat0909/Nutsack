import { db } from './src/lib/db';

async function main() {
  // Create a sample hunt
  const hunt = await db.hunt.create({
    data: {
      title: 'Victoria BC Scavenger Hunt',
      description: 'Discover the hidden gems of Victoria\'s most iconic locations in an unforgettable adventure through the city\'s rich history and stunning landscapes. Available until someone claims the $1000 prize!',
      maxParticipants: 1000,
      entryFee: 5.00,
      prizePool: 1000.00,
      prizeClaimed: false,
      isActive: true,
    },
  });

  console.log('Created hunt:', hunt);

  // Create some sample locations
  const locations = await Promise.all([
    db.location.create({
      data: {
        huntId: hunt.id,
        name: 'Inner Harbour',
        address: 'Inner Harbour, Victoria, BC',
        latitude: 48.4284,
        longitude: -123.3656,
        description: 'The heart of Victoria with stunning waterfront views and historic architecture.',
      },
    }),
    db.location.create({
      data: {
        huntId: hunt.id,
        name: 'Butchart Gardens',
        address: '800 Benvenuto Ave, Brentwood Bay, BC V8M 1A8',
        latitude: 48.5655,
        longitude: -123.4735,
        description: 'World-famous gardens with breathtaking floral displays.',
      },
    }),
    db.location.create({
      data: {
        huntId: hunt.id,
        name: 'Craigdarroch Castle',
        address: '1050 Joan Crescent, Victoria, BC V8S 3L5',
        latitude: 48.4266,
        longitude: -123.3384,
        description: 'Historic Victorian-era castle with panoramic city views.',
      },
    }),
  ]);

  console.log('Created locations:', locations);

  // Create some sample clues
  const clues = await Promise.all([
    db.clue.create({
      data: {
        huntId: hunt.id,
        locationId: locations[0].id,
        title: 'Harbour Secrets',
        description: 'Find the statue of Captain Cook and count the number of ships carved around its base.',
        difficulty: 1,
        points: 100,
        order: 1,
      },
    }),
    db.clue.create({
      data: {
        huntId: hunt.id,
        locationId: locations[1].id,
        title: 'Garden Maze',
        description: 'Navigate to the Rose Garden and find the oldest rose bush. What year was it planted?',
        difficulty: 2,
        points: 200,
        order: 2,
      },
    }),
    db.clue.create({
      data: {
        huntId: hunt.id,
        locationId: locations[2].id,
        title: 'Castle Tower',
        description: 'Climb to the top of the castle and count the number of steps. How many windows face the harbor?',
        difficulty: 3,
        points: 300,
        order: 3,
      },
    }),
  ]);

  console.log('Created clues:', clues);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });