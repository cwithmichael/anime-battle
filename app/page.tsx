"use client";

import Image from "next/image";
import styles from "./page.module.css";
import VoteCard from "@/app/ui/votes/voteCard";
import { getItem, getVoteCount, saveItem, vote } from "@/app/lib/repo";
import { useEffect, useState } from "react";
import ResultCard from "@/app/ui/results/resultCard";
import {
  checkCookie,
  fetchItem,
  getCookie,
  setCookie,
} from "@/app/lib/utils/actions";
import { Battle } from "@prisma/client";
import { convertAnimeItemToBattleItem } from "@/app/lib/utils/parser";
import { BattleItem } from "@/app/lib/types";
import {
  calculateVotePercentage,
  getBattleStatus,
  getRandomIds,
} from "@/app/lib/utils/general";

export default function Home() {
  const [firstItem, setFirstItem] = useState<BattleItem | undefined>();
  const [secondItem, setSecondItem] = useState<BattleItem | undefined>();
  const [fetchData, setFetchData] = useState(true);
  const [transition, setTransition] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [placeVote, setPlaceVote] = useState(false);
  const [battleData, setBattleData] = useState<{
    itemOneId: string;
    itemTwoId: string;
    selectedId: string;
  } | null>();
  const [voteData, setVoteData] = useState<{
    itemOneId: string;
    itemTwoId: string;
    itemOneVotes: number;
    itemTwoVotes: number;
    createdAt: Date;
  } | null>();
  useEffect(() => {
    async function fetchItemData() {
      console.log("fetching data");
      const maxInt = 10;
      const { x, y } = getRandomIds(maxInt);
      let item1 = await getItem(x);
      if (item1 === null) {
        console.log("fetching x", { x });
        const fetchedItem = await fetchItem(x);
        if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
      }
      let item2 = await getItem(y);
      if (item2 === null) {
        console.log("fetching y", { y });
        const fetchedItem = await fetchItem(y);
        if (fetchedItem) item2 = convertAnimeItemToBattleItem(fetchedItem);
      }
      let retryCount = 10;
      while (retryCount > 0) {
        const { x, y } = getRandomIds(maxInt);
        item1 = await getItem(x);
        if (!item1) {
          const fetchedItem = await fetchItem(x);
          if (fetchedItem) item1 = convertAnimeItemToBattleItem(fetchedItem);
        }
        item2 = await getItem(y);
        if (!item2) {
          const fetchedItem = await fetchItem(y);
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
        setFirstItem(item1);
        setSecondItem(item2);
      } else {
        console.log("failed to fetch data");
        setErrorState(true);
      }
    }
    if (fetchData) {
      fetchItemData();
    }
  }, [fetchData]);
  useEffect(() => {
    async function fetchVoteData() {
      if (firstItem && secondItem) {
        const voteResults = await getVoteCount(
          firstItem.itemId.toString(),
          secondItem.itemId.toString()
        );
        setVoteData(voteResults);
      }
    }
    fetchVoteData();
  }, [battleData, firstItem, secondItem, transition]);

  useEffect(() => {
    async function addVote() {
      try {
        if (battleData?.itemOneId && battleData.itemTwoId) {
          const battleCookie = await getCookie("battles");
          if (!battleCookie) {
            await setCookie(
              "battles",
              JSON.stringify([
                {
                  itemOneId: battleData.itemOneId,
                  itemTwoId: battleData.itemTwoId,
                },
              ])
            );
            await vote(
              battleData?.itemOneId,
              battleData?.itemTwoId,
              battleData?.selectedId
            );
            const voteResults = await getVoteCount(
              battleData.itemOneId,
              battleData.itemTwoId
            );
            console.log({ voteResults });
            setVoteData(voteResults);
          } else {
            const battles: Partial<Battle>[] = JSON.parse(battleCookie.value);
            const previousVote = await checkCookie(
              battleData.itemOneId,
              battleData.itemTwoId
            );
            console.log({ previousVote });
            if (!previousVote) {
              await setCookie(
                "battles",
                JSON.stringify([
                  ...battles,
                  {
                    itemOneId: battleData.itemOneId,
                    itemTwoId: battleData.itemTwoId,
                  },
                ])
              );
              await vote(
                battleData?.itemOneId,
                battleData?.itemTwoId,
                battleData?.selectedId
              );
              const voteResults = await getVoteCount(
                battleData.itemOneId,
                battleData.itemTwoId
              );
              console.log({ voteResults });
              setVoteData(voteResults);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (transition && placeVote) {
      addVote();
    }
  }, [battleData, placeVote, transition]);
  if (errorState) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div>Something Went Wrong</div>
          <div>Try Refreshing the Page</div>
        </main>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Anime Battle</h1>
      <main className={styles.main}>
        {transition ? (
          <>
            {firstItem &&
              secondItem &&
              voteData?.itemOneVotes !== undefined &&
              voteData?.itemTwoVotes !== undefined && (
                <>
                  <div className={styles.resultContainer}>
                    <ResultCard
                      battleStatus={getBattleStatus(
                        voteData?.itemOneVotes,
                        voteData?.itemTwoVotes
                      )}
                      votePercentage={calculateVotePercentage(
                        voteData?.itemOneVotes,
                        voteData?.itemTwoVotes
                      )}
                      numberOfVotes={voteData?.itemOneVotes}
                      firstName={firstItem.firstName}
                      lastName={firstItem.lastName}
                      image={firstItem.image}
                    />
                    <ResultCard
                      battleStatus={getBattleStatus(
                        voteData?.itemTwoVotes,
                        voteData?.itemOneVotes
                      )}
                      votePercentage={calculateVotePercentage(
                        voteData?.itemTwoVotes,
                        voteData?.itemOneVotes
                      )}
                      numberOfVotes={voteData?.itemTwoVotes}
                      firstName={secondItem.firstName}
                      lastName={secondItem.lastName}
                      image={secondItem.image}
                    />
                  </div>
                  <div className={styles.transition}>
                    <p className={styles.resultVotes}>
                      {voteData?.itemOneVotes + voteData?.itemTwoVotes} Total
                    </p>
                    <button
                      className={styles.nextButton}
                      onClick={() => {
                        setFirstItem(undefined);
                        setSecondItem(undefined);
                        setTransition(false);
                        setFetchData(true);
                      }}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
          </>
        ) : firstItem && secondItem ? (
          <form>
            <div className={styles.voteContainer}>
              <VoteCard
                itemId={firstItem.itemId.toString()}
                firstName={firstItem.firstName}
                lastName={firstItem.lastName}
                origin={firstItem.origin}
                image={firstItem.image}
                onSubmitHandler={() => {
                  setBattleData({
                    itemOneId: firstItem.itemId.toString(),
                    itemTwoId: secondItem.itemId.toString(),
                    selectedId: firstItem.itemId.toString(),
                  });
                  setTransition(true);
                  setPlaceVote(true);
                  setFetchData(false);
                }}
              />
              <Image
                height={250}
                width={250}
                alt={""}
                className={styles.vsImage}
                src={
                  "https://cdn.pixabay.com/photo/2024/08/26/04/20/ai-generated-8998102_1280.png"
                }
              />
              <VoteCard
                itemId={secondItem.itemId.toString()}
                firstName={secondItem.firstName}
                lastName={secondItem.lastName}
                origin={secondItem.origin}
                image={secondItem.image}
                onSubmitHandler={() => {
                  setBattleData({
                    itemOneId: firstItem.itemId.toString(),
                    itemTwoId: secondItem.itemId.toString(),
                    selectedId: secondItem.itemId.toString(),
                  });
                  setTransition(true);
                  setPlaceVote(true);
                  setFetchData(false);
                }}
              />
            </div>
          </form>
        ) : (
          <div>Loading...</div>
        )}
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
