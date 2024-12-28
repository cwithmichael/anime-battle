"use server";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { AnimeItem, BattleItem } from "@/app/lib/definitions";
import {
  convertAnimeItemToBattleItem,
  convertCharacterItemToBattleItem,
} from "./utils/parser";
import { getRandomIds } from "./utils/general";

export async function fetchAnimeItem(itemId: string) {
  const query = `query CharacterQuery($characterId: Int) {
    Character(id: $characterId) {
      id
      name {
        first
        last
      }
      image {
        medium
      }
      media {
        nodes {
          title {
            english
          }
        }
      }
    }
  }
  `;
  try {
    const data = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          characterId: itemId,
        },
      }),
    });
    if (data.status === 200) {
      const result = await data.json();
      return Response.json(result.data satisfies AnimeItem);
    }
    if (data.status === 404) {
      return Response.json(null, { status: 404 });
    }
  } catch (e) {
    console.error(e);
  }

  return Response.json(null, { status: 404 });
}

export async function createItems() {
  const maxInt = 3000;
  const { x, y } = getRandomIds(maxInt);
  let item1 = await getItem(x);
  let item2 = await getItem(y);
  if (item1 && item2 && item1.itemId !== item2.itemId) {
    return { item1, item2 };
  }
  let retryCount = 5;
  while (retryCount > 0 && (item1 === undefined || item2 === undefined)) {
    const { x, y } = getRandomIds(maxInt);
    if (!item1) {
      item1 = await getItem(x);
      if (!item1) {
        const data = await fetchAnimeItem(x);
        const fetchedItem: AnimeItem = await data.json();
        if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
      }
    }
    if (!item2) {
      item2 = await getItem(y);
      if (!item2) {
        const data = await fetchAnimeItem(y);
        const fetchedItem: AnimeItem = await data.json();
        if (fetchedItem) item2 = convertAnimeItemToBattleItem(fetchedItem);
      }
    }
    if (item1 && item2 && item1.itemId !== item2.itemId) {
      await saveItem(item1);
      await saveItem(item2);
      return { item1, item2 };
    }
    retryCount -= 1;
  }

  return undefined;
}

export async function saveItem(item: BattleItem) {
  await createItem(item);
}

export async function getItem(itemId: string) {
  const characterItem = await getCharacterItem(itemId);
  return characterItem
    ? convertCharacterItemToBattleItem(characterItem)
    : undefined;
}

export async function getVoteCount(itemId: string, itemId2: string) {
  return getVotes(itemId, itemId2);
}

export async function createUser(email: string) {
  try {
    await prisma.user.create({
      data: {
        email,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, user already exists"
        );
      }
    }
  }
}

export async function createBattle(itemOneId: string, itemTwoId: string) {
  try {
    await prisma.battle.create({
      data: {
        item_one_id: itemOneId,
        item_two_id: itemTwoId,
        item_one_votes: 0,
        item_two_votes: 0,
        created_at: new Date(),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, battle already exists"
        );
      }
    }
  }
}

export async function checkUserBattle(
  userEmail: string,
  itemOneId: string,
  itemTwoId: string
) {
  try {
    if (!userEmail) {
      return false;
    }
    const userBattle = await prisma.user_battle.findFirst({
      where: {
        item_one_id: itemOneId,
        item_two_id: itemTwoId,
        user_email: userEmail,
      },
    });
    return userBattle ? true : false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function createUserBattle(
  userEmail: string,
  itemOneId: string,
  itemTwoId: string
) {
  try {
    if (!userEmail) {
      return false;
    }
    await prisma.user_battle.create({
      data: {
        item_one_id: itemOneId,
        item_two_id: itemTwoId,
        user: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
    await prisma.user_battle.create({
      data: {
        item_one_id: itemTwoId,
        item_two_id: itemOneId,
        user: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return true;
    }
    throw e;
  }
  return false;
}

export async function createItem(item: BattleItem) {
  try {
    await prisma.item.create({
      data: {
        id: item.itemId,
        first_name: item.firstName,
        last_name: item.lastName,
        origin: item.origin,
        image: item.image,
        created_at: new Date(),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, item already exists"
        );
      }
    }
  }
}

export async function getVotes(itemOneId: string, itemTwoId: string) {
  const result = await prisma.battle.findFirst({
    where: {
      OR: [
        {
          item_one_id: itemOneId,
          item_two_id: itemTwoId,
        },
        {
          item_one_id: itemTwoId,
          item_two_id: itemOneId,
        },
      ],
    },
  });
  return result;
}

export async function getCharacterItem(itemId: string) {
  const result = await prisma.item.findFirst({
    where: {
      id: Number(itemId),
    },
  });
  return result;
}
export async function placeVote(
  isGuest: boolean,
  itemOneId: string,
  itemTwoId: string,
  selectedId: string,
  userId?: string
) {
  try {
    await createBattle(itemOneId, itemTwoId);
    if (selectedId === itemOneId) {
      await prisma.battle.update({
        where: {
          item_one_id_item_two_id: {
            item_one_id: itemOneId,
            item_two_id: itemTwoId,
          },
        },
        data: {
          item_one_votes: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.battle.update({
        where: {
          item_one_id_item_two_id: {
            item_one_id: itemOneId,
            item_two_id: itemTwoId,
          },
        },
        data: {
          item_two_votes: {
            increment: 1,
          },
        },
      });
    }
    if (userId && !isGuest) {
      await createUserBattle(userId, itemOneId, itemTwoId);
    }
  } catch (e) {
    throw e;
  }
}
