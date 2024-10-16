"use client";
import { useUserState, userState } from "@/app/_atoms/user";
import { decodeJWTToken } from "@/app/_utils/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { launchToast } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import useAxios from "@/lib/customAxios";
import { languageState } from "@/app/_atoms/language";

const url = "/user/signin";

const page: React.FC = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useUserState();
  const setLanguage = useSetRecoilState(languageState);
  const router = useRouter();

  const onSignin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      launchToast("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const data = await useAxios<{ token: string }>(url, "post", {
        email,
        password,
      });
      if (!data) {
        return;
      }

      let userData = await decodeJWTToken(data.token);
      window.localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setLanguage(userData.language);
      setIsLoading(false);
      router.push("/problems");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Input placeholder="E-mail" type="email" ref={emailRef} />
      <Input placeholder="Password" type="password" ref={passwordRef} />
      <Button className="mt-4" disabled={isLoading} onClick={onSignin}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>
      <Label>
        Do not have an account?{" "}
        <Link className="text-[#FFA123]" href="/signup">
          Sign up
        </Link>
      </Label>
    </>
  );
};

export default page;
