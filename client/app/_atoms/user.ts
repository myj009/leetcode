import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const userState = atom<{
  token: string;
  email: string;
  userId: string;
  userType: "admin" | "user";
} | null>({
  key: "user",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export function useUserState() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return [null, setUser] as const;

  return [user, setUser] as const;
}
