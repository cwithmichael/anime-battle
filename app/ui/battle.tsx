"use client";

import { BattleItem } from "@/app/lib/definitions";
import VoteForm from "./votes/voteForm";
import { useState } from "react";
import ResultForm from "./results/resultForm";

export default function Battle(props: {
  items: { item1: BattleItem; item2: BattleItem };
  voteData?: { item_one_votes: number | null; item_two_votes: number | null };
}) {
  const [transition, setTransition] = useState(false);
  return transition ? (
    props.items?.item1 &&
      props.items?.item2 &&
      props.voteData?.item_one_votes !== undefined &&
      props.voteData?.item_two_votes !== undefined && (
        <ResultForm
          items={props.items}
          voteData={props.voteData}
          setTransition={() => setTransition(!transition)}
        />
      )
  ) : (
    <VoteForm
      items={props.items}
      setTransition={() => {
        setTransition(!transition);
      }}
    />
  );
}
