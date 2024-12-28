"use client";

import { BattleItem } from "@/app/lib/definitions";
import styles from "./voteCard.module.css";
import Image from "next/image";

export default function VoteCard(props: {
  item?: BattleItem;
  setSelected: (item: BattleItem) => void;
}) {
  const { item, setSelected } = props;

  if (item) {
    return (
      <div className={styles.voteCard}>
        {item?.image && (
          <Image
            className={styles.itemImage}
            alt={""}
            src={item.image}
            height={120}
            width={120}
          />
        )}
        <p className={styles.itemTitle}>
          {item?.firstName} {item?.lastName}{" "}
        </p>
        <p className={styles.itemOrigin}>{item?.origin}</p>
        <button
          className={styles.voteButton}
          onClick={(e) => {
            e.preventDefault();
            setSelected(item);
          }}
        >
          Vote
        </button>
      </div>
    );
  } else {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }
}
