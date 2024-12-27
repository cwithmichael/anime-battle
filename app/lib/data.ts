"use server";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { BattleItem } from "@/app/lib/definitions";
import { convertCharacterItemToBattleItem } from "./utils/parser";

export async function vote(
  userId: string,
  itemId: string,
  itemId2: string,
  selected: string
) {
  console.log({ userId });
  await createBattle(itemId, itemId2);
  await placeVote(userId, itemId, itemId2, selected);
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
  return false;
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
      console.log("user battle exists");
      return true;
    }
    console.log("different error");
    throw e;
  }
  console.log("false");
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
  userId: string,
  itemOneId: string,
  itemTwoId: string,
  selectedId: string
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
    await createUserBattle(userId, itemOneId, itemTwoId);
  } catch (e) {
    throw e;
  }
}
