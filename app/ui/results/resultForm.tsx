"use client";

import ResultCard from "@/app/ui/results/resultCard";
import styles from "@/app/page.module.css";
import {
  calculateVotePercentage,
  getBattleStatus,
} from "@/app/lib/utils/general";
import { BattleItem } from "@/app/lib/definitions";

export default function ResultForm(props: {
  items: { item1: BattleItem; item2: BattleItem };
  voteData: { item_one_votes: number | null; item_two_votes: number | null };
  setTransition: () => void;
}) {
  if (
    props.voteData.item_one_votes === null ||
    props.voteData.item_two_votes === null
  ) {
    return null;
  }
  return (
    <>
      <div className={styles.resultContainer}>
        <ResultCard
          battleStatus={getBattleStatus(
            props.voteData?.item_one_votes,
            props.voteData?.item_two_votes
          )}
          votePercentage={calculateVotePercentage(
            props.voteData?.item_one_votes,
            props.voteData?.item_two_votes
          )}
          numberOfVotes={props.voteData?.item_one_votes}
          item={props.items?.item1}
        />
        <ResultCard
          battleStatus={getBattleStatus(
            props.voteData?.item_two_votes,
            props.voteData?.item_one_votes
          )}
          votePercentage={calculateVotePercentage(
            props.voteData?.item_two_votes,
            props.voteData?.item_one_votes
          )}
          numberOfVotes={props.voteData?.item_two_votes}
          item={props.items?.item2}
        />
      </div>
      <div className={styles.transition}>
        <p className={styles.resultVotes}>
          {props.voteData?.item_one_votes + props.voteData?.item_two_votes}{" "}
          Total
        </p>
        <button
          className={styles.nextButton}
          onClick={() => {
            props.setTransition();
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}
