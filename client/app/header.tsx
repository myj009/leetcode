"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import logo from "@/assets/leetcode.svg";
import lightLogo from "@/assets/leetcode-light.svg";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./themeToggle";
import { useUserState, userState } from "./_atoms/user";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

const Header: React.FC = () => {
  const [user, setUser] = useUserState();
  const router = useRouter();
  const path = usePathname();
  const { theme } = useTheme();

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/signin");
    setUser(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full px-5 sm:px-20 md:px-30 lg:px-40 py-3">
        <div className="flex gap-2 sm:gap-6 items-center">
          <Image
            src={theme === "dark" ? logo : lightLogo}
            alt="logo"
            width={24}
            height={24}
          />
          <div>
            <Button
              className={`font-semibold text-sm sm:text-md ${
                path === "/problems" && "underline"
              }`}
              variant="link"
              onClick={() => router.push("/problems")}
            >
              Problems
            </Button>
          </div>
        </div>
        <div className="flex text-sm sm:text-md gap-2 sm:gap-6 items-center">
          {!user ? (
            <div className="">
              <Link className="text-[#FFA123]" href="/signup">
                Register
              </Link>
              <span> or </span>
              <Link className="text-[#FFA123]" href="/signin">
                Sign In
              </Link>
            </div>
          ) : (
            <Button
              className="text-[#FFA123] px-0"
              onClick={logout}
              variant="link"
            >
              Logout
            </Button>
          )}
          <ThemeToggle />
          {user && (
            <Avatar className="hidden sm:block">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default Header;
