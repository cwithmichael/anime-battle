"use client";

import { BattleItem } from "@/app/lib/definitions";
import VoteForm from "./votes/voteForm";
import { useCallback, useEffect, useState } from "react";
import ResultForm from "./results/resultForm";
import { checkUserBattle, createItems, createUser } from "../lib/data";
import { useSession } from "next-auth/react";

export default function Battle() {
  const [voted, setVoted] = useState(false);
  const [transition, setTransition] = useState(false);
  const [items, setItems] = useState<
    | {
        item1: BattleItem;
        item2: BattleItem;
      }
    | undefined
  >(undefined);
  const { data: session, status, update } = useSession();
  async function fetchItems() {
    return createItems();
  }

  const checkIfVoted = useCallback(
    async (items?: { item1: BattleItem; item2: BattleItem }) => {
      if (session && status === "authenticated" && session.user?.email) {
        if (items?.item1?.itemId && items?.item2?.itemId) {
          return checkUserBattle(
            session.user?.email,
            items?.item1?.itemId?.toString(),
            items?.item2?.itemId?.toString()
          );
        }
      }
      return false;
    },
    [session, status]
  );

  useEffect(() => {
    let ignore = false;
    fetchItems().then((items) => {
      if (!ignore) {
        setItems(items);
        setTransition(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    checkIfVoted(items).then((didVote) => {
      setVoted(didVote);
    });
  }, [checkIfVoted, items, transition]);

  function resultTransition() {
    fetchItems().then((items) => {
      if (items) {
        setItems(items);
      }
      checkIfVoted(items).then((didVote) => {
        if (!didVote) {
          setTransition(false);
        }
      });
    });
  }

  useEffect(() => {
    async function createUserInDB(email: string) {
      await createUser(email);
    }
    if (session && status === "authenticated" && session.user?.email) {
      createUserInDB(session.user?.email);
    }
  }, [session, status, update]);

  if (!items) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }
  if (transition || voted) {
    return (
      items?.item1 &&
      items?.item2 && (
        <ResultForm
          items={items}
          key={JSON.stringify(items)}
          setStartNewBattle={() => {
            resultTransition();
          }}
        />
      )
    );
  }
  return (
    <VoteForm
      items={items}
      key={JSON.stringify(items)}
      setTransition={() => {
        setTransition(true);
      }}
      session={session}
      userStatus={status}
      userId={session?.user?.email ?? undefined}
      votingDisabled={false}
    />
  );
}
