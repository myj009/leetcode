"use client";
import { useRecoilValue } from "recoil";
import { userState } from "@/app/_atoms/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Problem } from "./types";

const url = "/problems";

export default function Home() {
  const user = useRecoilValue(userState);
  const { data, loading } = useAxios<Problem[]>(url);
  const router = useRouter();

  return (
    <main className="flex flex-col p-40 justify-center items-start pt-20">
      {loading && data ? (
        <Loader2 className="mr-2 h-20 w-20 animate-spin" />
      ) : (
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[120px]">Difficulty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((problem) => {
              return (
                <TableRow
                  key={problem.id}
                  onClick={() =>
                    router.push(`/problems/${problem.id}/description`)
                  }
                  className="hover:cursor-pointer"
                >
                  <TableCell>{problem.id}</TableCell>
                  <TableCell>{problem.title}</TableCell>

                  <TableCell
                    className={`${
                      problem?.level === "hard"
                        ? "text-red-500"
                        : problem?.level === "easy"
                        ? "text-green-500"
                        : problem?.level === "medium"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {problem.level.charAt(0).toUpperCase() +
                      problem.level.slice(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
