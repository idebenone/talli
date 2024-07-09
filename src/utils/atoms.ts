import { atom } from "jotai";
import { EventUsers } from "@/lib/types";
import { User } from "@supabase/supabase-js";

export const userAtom = atom<User | null>(null);
userAtom.debugLabel = "useSession";

export const EventUsersListAtom = atom<EventUsers[]>([]);
EventUsersListAtom.debugLabel = "eventUsersList";