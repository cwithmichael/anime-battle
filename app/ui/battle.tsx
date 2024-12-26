"use client";

import { AnimeItem, BattleItem } from "@/app/lib/definitions";
import VoteForm from "./votes/voteForm";
import { useEffect, useState } from "react";
import ResultForm from "./results/resultForm";
import {
  createBattle,
  createUser,
  createUserBattle,
  getItem,
  saveItem,
} from "../lib/data";
import { getRandomIds } from "../lib/utils/general";
import { convertAnimeItemToBattleItem } from "../lib/utils/parser";
import { useSession } from "next-auth/react";

async function fetchAnimeItem(itemId: string) {
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

async function createItems() {
  const maxInt = 1000;
  const { x, y } = getRandomIds(maxInt);
  let item1 = await getItem(x);
  if (item1 === null) {
    const data = await fetchAnimeItem(x);
    const fetchedItem: AnimeItem = await data.json();
    if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
  }
  let item2 = await getItem(y);
  if (item2 === null) {
    const data = await fetchAnimeItem(y);
    const fetchedItem: AnimeItem = await data.json();
    if (fetchedItem) item2 = convertAnimeItemToBattleItem(fetchedItem);
  }
  let retryCount = 5;
  while (retryCount > 0) {
    const { x, y } = getRandomIds(maxInt);
    item1 = await getItem(x);
    if (!item1) {
      const data = await fetchAnimeItem(x);
      const fetchedItem: AnimeItem = await data.json();
      if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
    }
    item2 = await getItem(y);
    if (!item2) {
      const data = await fetchAnimeItem(y);
      const fetchedItem: AnimeItem = await data.json();
      if (fetchedItem) item2 = convertAnimeItemToBattleItem(fetchedItem);
    }
    if (item1 && item2 && item1.itemId !== item2.itemId) {
      break;
    }
    retryCount -= 1;
  }
  if (item1 && item2 && item1.itemId !== item2.itemId) {
    await saveItem(item1);
    await saveItem(item2);
    return { item1, item2 };
  } else {
    return undefined;
  }
}

export default function Battle() {
  const [startNewBattle, setStartNewBattle] = useState(true);
  const [transition, setTransition] = useState(false);
  const [items, setItems] = useState<
    | {
        item1: BattleItem;
        item2: BattleItem;
      }
    | undefined
  >(undefined);
  const { data: session, status, update } = useSession();

  useEffect(() => {
    async function createUserInDB(email: string) {
      await createUser(email);
    }
    if (session && status === "authenticated" && session.user?.email) {
      createUserInDB(session.user?.email);
    }
  }, [session, status, update]);

  useEffect(() => {
    async function fetchItems() {
      const items = await createItems();
      if (items) {
        setItems(items);
        let votedAlready = false;
        if (session && status === "authenticated" && session.user?.email) {
          votedAlready = await createUserBattle(
            session.user?.email,
            items?.item1.itemId.toString(),
            items.item2.itemId.toString()
          );
        }
        if (!votedAlready) {
          await createBattle(
            items?.item1.itemId.toString(),
            items.item2.itemId.toString()
          );
        } else {
          setStartNewBattle(true);
        }
      }
    }
    if (startNewBattle) {
      fetchItems().catch();
    }
  }, [session, startNewBattle, status]);
  if (!items) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }
  if (transition) {
    return (
      items?.item1 &&
      items?.item2 && (
        <ResultForm
          items={items}
          setStartNewBattle={() => {
            setStartNewBattle(true);
            setTransition(false);
            setItems(undefined);
          }}
        />
      )
    );
  }
  return (
    <VoteForm
      items={items}
      setTransition={() => {
        setStartNewBattle(false);
        setTransition(true);
      }}
    />
  );
}
