"use server";

import prisma from "../db";
import { Prisma } from "@prisma/client";
import { BattleItem } from "../types";

export async function createBattle(itemOneId: string, itemTwoId: string) {
  try {
    await prisma.battle.create({
      data: {
        itemOneId,
        itemTwoId,
        itemOneVotes: 0,
        itemTwoVotes: 0,
        createdAt: new Date(),
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
    await prisma.characterItem.create({
      data: {
        id: item.itemId.toString(),
        firstName: item.firstName,
        lastName: item.lastName,
        origin: item.origin,
        image: item.image,
        createdAt: new Date(),
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
      itemOneId,
      itemTwoId,
    },
  });
  return result;
}

export async function getCharacterItem(itemId: string) {
  const result = await prisma.characterItem.findFirst({
    where: {
      id: itemId,
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
          itemOneId_itemTwoId: { itemOneId, itemTwoId },
        },
        data: {
          itemOneVotes: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.battle.update({
        where: {
          itemOneId_itemTwoId: { itemOneId, itemTwoId },
        },
        data: {
          itemTwoVotes: {
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
