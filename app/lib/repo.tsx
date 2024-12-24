"use server";

import { BattleItem } from "./types";
import { convertCharacterItemToBattleItem } from "./utils/parser";
import {
  createBattle,
  createItem,
  getCharacterItem,
  getVotes,
  placeVote,
} from "./utils/query";

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
