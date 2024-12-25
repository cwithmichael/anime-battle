import { item } from "@prisma/client";
import { AnimeItem, BattleItem } from "../types";

export function convertAnimeItemToBattleItem(item: AnimeItem) {
  console.log("convert Item", { item });
  return {
    itemId: item.Character.id,
    firstName: item.Character.name.first,
    lastName: item.Character.name.last,
    origin: item.Character.media?.nodes[0]?.title?.english,
    image: item.Character.image.medium,
  };
}

export function convertCharacterItemToBattleItem(item: item) {
  console.log("convert Item", { item });
  return {
    itemId: Number(item.id),
    firstName: item.first_name,
    lastName: item.last_name,
    origin: item.origin,
    image: item.image,
  } satisfies BattleItem;
}
