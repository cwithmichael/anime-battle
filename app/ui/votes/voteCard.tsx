"use client";

import styles from "./voteCard.module.css";
import Image from "next/image";

export default function VoteCard(props: {
  image: string;
  itemId: string;
  firstName: string;
  lastName: string;
  origin: string;
  onSubmitHandler(itemId: string): void;
}) {
  const { image, firstName, lastName, onSubmitHandler, origin } = props;

  return (
    <div
      className={styles.voteCard}
      onClick={(e) => {
        e.preventDefault();
        onSubmitHandler(props.itemId);
      }}
    >
      <Image
        className={styles.itemImage}
        alt={""}
        src={image}
        height={250}
        width={250}
      />
      <p className={styles.itemTitle}>
        {firstName} {lastName}{" "}
      </p>
      <p className={styles.itemOrigin}>{origin}</p>
      <button
        className={styles.voteButton}
        onClick={(e) => {
          e.preventDefault();
          onSubmitHandler(props.itemId);
        }}
      >
        Vote
      </button>
    </div>
  );
}
