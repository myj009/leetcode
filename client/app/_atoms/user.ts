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
  const [isInitial, setIsInitial] = useState(true);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? null : user, setUser] as const;
}
