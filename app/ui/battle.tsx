"use client";

import { AnimeItem, BattleItem } from "@/app/lib/definitions";
import VoteForm from "./votes/voteForm";
import { useEffect, useState } from "react";
import ResultForm from "./results/resultForm";
import { checkUserBattle, createUser, getItem, saveItem } from "../lib/data";
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
  const maxInt = 3000;
  const { x, y } = getRandomIds(maxInt);
  let item1 = await getItem(x);
  let item2 = await getItem(y);
  if (item1 && item2 && item1.itemId !== item2.itemId) {
    return { item1, item2 };
  }
  let retryCount = 5;
  while (retryCount > 0 && (item1 === undefined || item2 === undefined)) {
    const { x, y } = getRandomIds(maxInt);
    if (!item1) {
      item1 = await getItem(x);
      if (!item1) {
        const data = await fetchAnimeItem(x);
        const fetchedItem: AnimeItem = await data.json();
        if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
      }
    }
    if (!item2) {
      item2 = await getItem(y);
      if (!item2) {
        const data = await fetchAnimeItem(y);
        const fetchedItem: AnimeItem = await data.json();
        if (fetchedItem) item2 = convertAnimeItemToBattleItem(fetchedItem);
      }
    }
    if (item1 && item2 && item1.itemId !== item2.itemId) {
      await saveItem(item1);
      await saveItem(item2);
      return { item1, item2 };
    }
    retryCount -= 1;
  }

  return undefined;
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
  const [votedAlready, setVotedAlready] = useState(false);
  async function fetchItems() {
    return createItems();
  }

  useEffect(() => {
    async function createUserInDB(email: string) {
      await createUser(email);
    }
    if (session && status === "authenticated" && session.user?.email) {
      createUserInDB(session.user?.email);
    }
  }, [session, status, update]);

  useEffect(() => {
    if (startNewBattle) {
      fetchItems()
        .then((items) => {
          if (items) {
            setItems(items);
          }
          async function checkIfVoted() {
            if (session && status === "authenticated" && session.user?.email) {
              if (items?.item1?.itemId && items?.item2?.itemId) {
                const voted = await checkUserBattle(
                  session.user?.email,
                  items?.item1?.itemId?.toString(),
                  items?.item2?.itemId?.toString()
                );
                if (voted) {
                  console.log("voted already");
                  setStartNewBattle(true);
                }
              }
            }
          }
          checkIfVoted();
          setStartNewBattle(false);
        })
        .catch();
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
      setVotedAlready={() => {
        setVotedAlready(true);
        setTransition(true);
      }}
      session={session}
      userStatus={status}
      userId={session?.user?.email ?? undefined}
      votingDisabled={votedAlready}
    />
  );
}
