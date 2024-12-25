"use server";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { BattleItem } from "./types";
import { convertCharacterItemToBattleItem } from "./utils/parser";

export async function vote(itemId: string, itemId2: string, selected: string) {
  await createBattle(itemId, itemId2);
  await placeVote(itemId, itemId2, selected);
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
      item_one_id: itemOneId,
      item_two_id: itemTwoId,
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
  itemOneId: string,
  itemTwoId: string,
  selectedId: string
) {
  try {
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
  } catch (e) {
    console.log(e);
    throw e;
  }
}
