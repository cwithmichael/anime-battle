"use server";

import { battle } from "@prisma/client";
import { cookies } from "next/headers";
import * as gzip from "zlib";
import { pipeline } from "stream";

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function checkCookie(itemOneId: string, itemTwoId: string) {
  const cookieStore = await cookies();
  const battles = cookieStore.get("battles");
  if (battles) {
    const battleList: Partial<battle>[] = JSON.parse(battles.value);
    console.log({ battleList });
    for (const battle of battleList) {
      if (
        battle.item_one_id === itemOneId &&
        battle.item_two_id === itemTwoId
      ) {
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
