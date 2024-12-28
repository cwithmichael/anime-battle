"use client";

import { BattleItem } from "@/app/lib/definitions";
import styles from "@/app/page.module.css";
import VoteCard from "./voteCard";
import Image from "next/image";
import { placeVote } from "@/app/lib/data";
import { Session } from "next-auth";

export default function VoteForm(props: {
  userId?: string;
  session: Session | null;
  userStatus: string;
  items?: { item1: BattleItem; item2: BattleItem };
  setTransition: () => void;
  isGuest: boolean;
}) {
  async function userVote(selected: BattleItem) {
    if (
      selected &&
      props.items &&
      props.items?.item1?.itemId &&
      props.items?.item2.itemId
    ) {
      if (props.session && props.userStatus === "authenticated") {
        if (typeof props.session?.user?.email === "string") {
          await placeVote(
            false,
            props.items?.item1.itemId.toString(),
            props.items.item2.itemId.toString(),
            selected.itemId.toString(),
            props.session.user?.email
          );
        }
      }
      if (props.isGuest) {
        await placeVote(
          true,
          props.items?.item1.itemId.toString(),
          props.items.item2.itemId.toString(),
          selected.itemId.toString()
        );
      }
      props.setTransition();
    }
  }
  return (
    <form>
      <div className={styles.voteContainer}>
        <VoteCard
          item={props.items?.item1}
          setSelected={(item: BattleItem) => {
            userVote(item);
          }}
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
          setSelected={(item: BattleItem) => {
            userVote(item);
          }}
        />
      </div>
    </form>
  );
}
