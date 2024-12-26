"use server";

import { battle } from "@prisma/client";
import { cookies } from "next/headers";
import zlib from "zlib";

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
  zlib.gzip(value, (err, compressed) => {
    if (err) {
      console.error(err);
      return;
    }
    cookieStore.set({
      name: name,
      value: compressed.toString("base64"),
      httpOnly: true,
      secure: true,
      expires: expiresAt,
    });
  });
}
