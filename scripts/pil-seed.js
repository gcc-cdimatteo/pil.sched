const { db } = require('@vercel/postgres');
const {
  clients,
  occupation,
  fixed_clients
} = require('../app/lib/pil-placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedClients(dbClient) {
  try {
    await dbClient.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await dbClient.sql`
      CREATE TABLE IF NOT EXISTS clients (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        cellphone VARCHAR(255) NOT NULL,
        email TEXT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "clients" table`);

    // Insert data into the "users" table
    const insertedClients = await Promise.all(
      clients.map(async (client) => {
        const hashedPassword = await bcrypt.hash(client.password, 10);
        return dbClient.sql`
        INSERT INTO clients (name, surname, cellphone, email, password)
        VALUES (${client.name}, ${client.surname}, ${client.cellphone}, ${client.email}, ${hashedPassword})
      `;
      }),
    );

    console.log(`Seeded ${insertedClients.length} clients`);

    return {
      createTable,
      clients: insertedClients,
    };
  } catch (error) {
    console.error('Error seeding clients:', error);
    throw error;
  }
}

async function main() {
  const dbClient = await db.connect();

  await seedClients(dbClient);

  await dbClient.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
