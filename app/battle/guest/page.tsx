"use client";

import { GuestContext } from "@/app/lib/context";
import Page from "../page";

export default function WrappedPage() {
  return (
    <GuestContext.Provider value={true}>
      <Page></Page>
    </GuestContext.Provider>
  );
}
