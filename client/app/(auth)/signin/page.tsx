"use client";
import { userState } from "@/app/_atoms/user";
import { decodeJWTToken } from "@/app/_utils/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { launchToast } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

const url = "http://localhost:3001/user/signin";

const page: React.FC = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetRecoilState(userState);
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
      const res = await axios.post<{ token: string } | string>(url, {
        email,
        password,
      });
      if (res.status !== 200) {
        throw Error(res.data as string);
      }
      const data = res.data as { token: string };
      let userData = await decodeJWTToken(data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      setIsLoading(false);
      router.push("/");
    } catch (e) {
      console.log(e);
      const err = e as AxiosError;
      launchToast(err.response?.data as string);
      setIsLoading(false);
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
