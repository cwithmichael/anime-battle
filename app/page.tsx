"use client";

import styles from "./page.module.css";
import { getVoteCount, vote } from "@/app/lib/data";
import { useEffect, useState } from "react";
import { checkCookie, getCookie, setCookie } from "@/app/lib/utils/actions";
import { BattleItem } from "@/app/lib/types";

export default function Home() {
  /* useEffect(() => {
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
  }, [battleData, placeVote, transition]);*/
  const errorState = false;
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
      <footer className={styles.footer}></footer>
    </div>
  );
}
