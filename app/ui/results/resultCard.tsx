"use client";

import clsx from "clsx";
import styles from "./resultCard.module.css";
import Image from "next/image";
import { BattleItem } from "@/app/lib/definitions";

export default function resultCard(props: {
  className?: string;
  item: BattleItem;
  numberOfVotes: number;
  votePercentage?: number;
  battleStatus: string;
}) {
  const { battleStatus, className, item, numberOfVotes, votePercentage } =
    props;
  return (
    <div className={styles.resultCard}>
      <div
        className={clsx(
          battleStatus === "Winner" && styles.winner,
          battleStatus === "Loser" && styles.loser,
          battleStatus === "Tied" && styles.tied,
          className
        )}
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
        <div className={styles.resultCardDetails}>
          <p className={styles.battleStatus}>{battleStatus}</p>

          <p className={styles.itemTitle}>
            {item.firstName} {item.lastName}{" "}
          </p>
          <p>
            {votePercentage !== undefined && isNaN(votePercentage)
              ? 0
              : votePercentage?.toFixed(2)}
            %
          </p>
          <p>
            {" "}
            {numberOfVotes} Vote
            {numberOfVotes > 1 || numberOfVotes == 0 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
