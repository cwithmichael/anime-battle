import styles from "@/app/page.module.css";
import { getItem, getVoteCount, saveItem } from "@/app/lib/data";

import { getRandomIds } from "@/app/lib/utils/general";
import { AnimeItem } from "@/app/lib/definitions";
import { convertAnimeItemToBattleItem } from "@/app/lib/utils/parser";
import Battle from "../ui/votes/battle";

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
  let retryCount = 5;
  const dryRun = false;
  while (itemId && retryCount > 0 && !dryRun) {
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
        return Response.json(result.data satisfies AnimeItem);
      }
      if (data.status === 404) {
        console.log(`could not get item with id: ${itemId}`);
        return Response.json(null, { status: 404 });
      }
    } catch (e) {
      console.error(e);
    }
    retryCount -= 1;
  }
  console.log(`could not get item with id: ${itemId}`);
  return Response.json(null, { status: 404 });
}

async function createItems() {
  const maxInt = 10;
  const { x, y } = getRandomIds(maxInt);
  let item1 = await getItem(x);
  console.log({ item1 });
  if (item1 === null) {
    console.log("fetching x", { x });
    const data = await fetchAnimeItem(x);
    const fetchedItem: AnimeItem = await data.json();
    if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
  }
  let item2 = await getItem(y);
  console.log({ item2 });
  if (item2 === null) {
    console.log("fetching y", { y });
    const data = await fetchAnimeItem(y);
    const fetchedItem: AnimeItem = await data.json();
    if (fetchedItem) item2 = convertAnimeItemToBattleItem(fetchedItem);
  }
  let retryCount = 10;
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
  console.log("after break", { item1, item2 });
  if (item1 && item2 && item1.itemId !== item2.itemId) {
    await saveItem(item1);
    await saveItem(item2);
    return { item1, item2 };
  } else {
    console.log("failed to fetch data");
    return undefined;
  }
}

export default async function Page() {
  const items = await createItems();
  let voteData;
  console.log({ items });
  if (items?.item1 && items?.item2) {
    voteData = await getVoteCount(
      items?.item1?.itemId?.toString(),
      items?.item2.itemId?.toString()
    );
  }
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Anime Battle</h1>
        {items ? (
          <Battle
            items={items}
            voteData={
              voteData
                ? {
                    item_one_votes: voteData.item_one_votes,
                    item_two_votes: voteData.item_two_votes,
                  }
                : undefined
            }
          />
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </div>
  );
}
