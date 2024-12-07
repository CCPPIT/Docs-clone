"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
    const params=useParams()
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_9L8IFLhTpQGsbHjmBuJktjmv1w17lJkTYhlRIaZxctndumX5kp-W9iroDWTCRY-g"}>
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}