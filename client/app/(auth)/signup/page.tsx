"use client";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import useAxios from "@/lib/customAxios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { launchToast } from "@/lib/utils";

const url = "/user/signup";

const Signup = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSignup = async () => {
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPass = confirmPasswordRef.current?.value;

    if (!email || !phone || !password || !confirmPass) {
      launchToast("Please fill all fields");
      return;
    }
    if (password !== confirmPass) {
      launchToast("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      launchToast("Password should be of atleast 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const data = await useAxios<string>(url, "post", {
        email,
        phone,
        password,
      });
      if (!data) {
        return;
      }

      setIsLoading(false);
      router.push("/signin");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Input placeholder="Email address" type="email" ref={emailRef} />
      <Input placeholder="Phone Number" type="text" ref={phoneRef} />
      <Input placeholder="Password" type="password" ref={passwordRef} />
      <Input
        placeholder="Confirm password"
        type="password"
        ref={confirmPasswordRef}
      />
      <Button disabled={isLoading} className="mt-6" onClick={onSignup}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign up
      </Button>
      <Label>
        Have an account?{" "}
        <Link href="/signin" className="text-[#FFA123]">
          Sign in
        </Link>
      </Label>
    </>
  );
};

export default Signup;
