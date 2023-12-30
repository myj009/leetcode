"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const Problem: React.FC = () => {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    router.replace(`${path}/description`);
  });
  return <></>;
};

export default Problem;
