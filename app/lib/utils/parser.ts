import { item } from "@prisma/client";
import { AnimeItem, BattleItem } from "@/app/lib/definitions";

export function convertAnimeItemToBattleItem(item: AnimeItem) {
  return {
    itemId: item.Character.id,
    firstName: item.Character.name.first,
    lastName: item.Character.name.last,
    origin: item.Character.media?.nodes[0]?.title?.english,
    image: item.Character.image.medium,
  };
}

export function convertCharacterItemToBattleItem(item: item) {
  return {
    itemId: Number(item.id),
    firstName: item.first_name ?? undefined,
    lastName: item.last_name ?? undefined,
    origin: item.origin ?? undefined,
    image: item.image ?? undefined,
  } satisfies BattleItem;
}
