"use client";

import { BattleItem } from "@/app/lib/definitions";
import styles from "@/app/page.module.css";
import VoteCard from "./voteCard";
import Image from "next/image";

export default function VoteForm(props: {
  items: { item1: BattleItem; item2: BattleItem };
  setTransition: () => void;
}) {
  return (
    <form>
      <div className={styles.voteContainer}>
        <VoteCard
          item={props.items?.item1}
          setTransition={props.setTransition}
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
          item={props.items?.item2}
          setTransition={props.setTransition}
        />
      </div>
    </form>
  );
}
