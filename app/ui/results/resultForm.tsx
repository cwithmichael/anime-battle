"use client";

import ResultCard from "@/app/ui/results/resultCard";
import styles from "@/app/page.module.css";
import {
  calculateVotePercentage,
  getBattleStatus,
} from "@/app/lib/utils/general";
import { BattleItem } from "@/app/lib/definitions";
import { battle } from "@prisma/client";
import { getVoteCount } from "@/app/lib/data";
import { useState, useEffect } from "react";

export default function ResultForm(props: {
  items: { item1: BattleItem; item2: BattleItem };
  setStartNewBattle: () => void;
}) {
  const [voteData, setVoteData] = useState<battle | null>();
  useEffect(() => {
    async function fetchVoteData() {
      const voteCount = await getVoteCount(
        props.items?.item1?.itemId?.toString(),
        props.items?.item2.itemId?.toString()
      );
      if (voteCount) {
        setVoteData(voteCount);
      }
    }
    if (props.items?.item1 && props.items?.item2) {
      fetchVoteData();
    }
  }, [props.items?.item1, props.items?.item2]);
  if (
    voteData &&
    typeof voteData.item_one_votes === "number" &&
    voteData &&
    typeof voteData.item_two_votes === "number"
  )
    return (
      <>
        <div className={styles.resultContainer}>
          <ResultCard
            battleStatus={getBattleStatus(
              voteData.item_one_votes,
              voteData.item_two_votes
            )}
            votePercentage={calculateVotePercentage(
              voteData.item_one_votes,
              voteData.item_two_votes
            )}
            numberOfVotes={voteData.item_one_votes}
            item={props.items?.item1}
          />
          <ResultCard
            battleStatus={getBattleStatus(
              voteData?.item_two_votes,
              voteData?.item_one_votes
            )}
            votePercentage={calculateVotePercentage(
              voteData?.item_two_votes,
              voteData?.item_one_votes
            )}
            numberOfVotes={voteData?.item_two_votes}
            item={props.items?.item2}
          />
        </div>
        <div className={styles.transition}>
          <p className={styles.resultVotes}>
            {voteData?.item_one_votes + voteData?.item_two_votes} Total
          </p>
          <button
            className={styles.nextButton}
            onClick={() => {
              props.setStartNewBattle();
            }}
          >
            Next
          </button>
        </div>
      </>
    );
}
