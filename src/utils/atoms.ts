import { atom } from "jotai";
import { EventUsers } from "@/lib/types";
import { RealtimeChannel, User } from "@supabase/supabase-js";

export const userAtom = atom<User | null>(null);
userAtom.debugLabel = "useSession";

export const EventUsersListAtom = atom<EventUsers[]>([]);
EventUsersListAtom.debugLabel = "eventUsersList";

export const EventChannelAtom = atom<RealtimeChannel | null>(null);
EventChannelAtom.debugLabel = "eventChannel"