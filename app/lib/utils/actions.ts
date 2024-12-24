"use server";

import { AnimeItem } from "../types";
import { Battle } from "@prisma/client";
import { cookies } from "next/headers";
import * as gzip from "zlib";
import { pipeline } from "stream";

export async function fetchItem(
  itemId: string,
  dryRun?: boolean
): Promise<AnimeItem | undefined> {
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
  let retryCount = 5;
  dryRun = false;
  while (retryCount > 0 && !dryRun) {
    try {
      console.log("hitting endpoint", `ItemID:${itemId}`);
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
      console.log({ data });
      if (data.status === 200) {
        const result = await data.json();
        console.log({ result });
        return result.data satisfies AnimeItem;
      }
      if (data.status === 404) {
        console.error(`could not get item with id: ${itemId}`);
        return undefined;
      }
    } catch (e) {
      console.error(e);
    }
    retryCount -= 1;
  }
  console.error(`could not get item with id: ${itemId}`);
  return undefined;
}
export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function checkCookie(itemOneId: string, itemTwoId: string) {
  const cookieStore = await cookies();
  const battles = cookieStore.get("battles");
  if (battles) {
    const battleList: Partial<Battle>[] = JSON.parse(battles.value);
    console.log({ battleList });
    for (const battle of battleList) {
      if (battle.itemOneId === itemOneId && battle.itemTwoId === itemTwoId) {
        return true;
      }
    }
  }
  return false;
}
export async function setCookie(name: string, value: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const zip = gzip.createGzip();
  pipeline(value, zip, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    // const session = await encrypt({ userId, expiresAt })
    cookieStore.set({
      name: name,
      value: value,
      httpOnly: true,
      secure: true,
      expires: expiresAt,
    });
  });
}
