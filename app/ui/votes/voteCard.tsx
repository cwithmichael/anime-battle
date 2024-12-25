"use client";

import { BattleItem } from "@/app/lib/definitions";
import styles from "./voteCard.module.css";
import Image from "next/image";

export default function VoteCard(props: {
  item: BattleItem;
  setTransition: () => void;
}) {
  const { item, setTransition } = props;

  return (
    <div
      className={styles.voteCard}
      onClick={(e) => {
        e.preventDefault();
        setTransition();
      }}
    >
      {item.image && (
        <Image
          className={styles.itemImage}
          alt={""}
          src={item.image}
          height={250}
          width={250}
        />
      )}
      <p className={styles.itemTitle}>
        {item.firstName} {item.lastName}{" "}
      </p>
      <p className={styles.itemOrigin}>{item.origin}</p>
      <button
        className={styles.voteButton}
        onClick={(e) => {
          e.preventDefault();
          setTransition();
        }}
      >
        Vote
      </button>
    </div>
  );
}
