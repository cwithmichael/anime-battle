import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { battles, items, users } from "@/app/lib/placeholder-data";

const client = await db.connect();

async function seedItems() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS item (
      id integer PRIMARY KEY,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      origin VARCHAR(255),
      image VARCHAR(255),
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedItems = await Promise.all(
    items.map(async (item) => {
      return client.sql`
        INSERT INTO item (id, first_name, last_name, origin, image)
        VALUES (${Number(item.id)}, ${item.firstName}, ${item.lastName}, ${
        item.origin
      }, ${item.image})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedItems;
}

async function seedBattles() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS battle (
      item_one_id text not null,
      item_two_id text not null,
      item_one_votes integer DEFAULT 0,
      item_two_votes integer DEFAULT 0,
      createdAt timestamptz DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (item_one_id, item_two_id)
    );
  `;

  const insertedBattles = await Promise.all(
    battles.map(async (battle) => {
      console.log(
        `${battle.itemOneId}, ${battle.itemTwoId}, ${battle.itemOneVotes}, ${battle.itemTwoVotes}`
      );
      return client.sql`
        INSERT INTO battle (item_one_id, item_two_id, item_one_votes, item_two_votes )
        VALUES (${battle.itemOneId}, ${battle.itemTwoId}, ${battle.itemOneVotes}, ${battle.itemTwoVotes})
        ON CONFLICT (item_one_id, item_two_id) DO NOTHING;
      `;
    })
  );

  return insertedBattles;
}

async function seedUsers() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(255) NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      console.log(`${user.name}, ${user.username}, ${hashedPassword}`);
      return client.sql`
        INSERT INTO users (name, username, password)
        VALUES (${user.name}, ${user.username}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedItems();
    await seedBattles();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error({ error });
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
