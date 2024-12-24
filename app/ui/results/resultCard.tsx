"use client";

import clsx from "clsx";
import styles from "./resultCard.module.css";
import Image from "next/image";

export default function resultCard(props: {
  className?: string;
  image: string;
  firstName: string;
  lastName: string;
  numberOfVotes: number;
  votePercentage?: number;
  battleStatus: string;
}) {
  const {
    battleStatus,
    className,
    image,
    firstName,
    lastName,
    numberOfVotes,
    votePercentage,
  } = props;
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
        <Image
          className={styles.itemImage}
          alt={""}
          src={image}
          height={250}
          width={250}
        />
        <div className={styles.resultCardDetails}>
          <p className={styles.battleStatus}>{battleStatus}</p>

          <p className={styles.itemTitle}>
            {firstName} {lastName}{" "}
          </p>
          <p>{votePercentage?.toFixed(2)}%</p>
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
