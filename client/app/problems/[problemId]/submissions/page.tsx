"use client";
import { TabsContent } from "@/components/ui/tabs";
import React, { ReactEventHandler, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemProps, languages } from "../../types";
import { useAxiosArray } from "@/hooks/useAxios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserState } from "@/app/_atoms/user";
import { SubmissionSchema } from "./types";
import { format } from "date-fns";
import axios, { AxiosError } from "axios";
import { launchToast } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import path from "path";
import { useSetRecoilState } from "recoil";
import { codeState } from "@/app/_atoms/code";
import { languageState } from "@/app/_atoms/language";

const ProblemSubmissions: React.FC<ProblemProps> = ({ params }) => {
  const [user] = useUserState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SubmissionSchema[]>([]);
  const setCode = useSetRecoilState(codeState);
  const setLang = useSetRecoilState(languageState);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const submissionId = searchParams.get("submissionId");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .post(
        "http://localhost:3001/submissions",
        { problem_id: params.problemId },
        {
          headers: {
            Authorization: user?.token,
          },
        }
      )
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw Error(res.data as string);
        }
        console.log(res);
        setData(res.data);
      })
      .catch((err) => {
        const e = err as AxiosError;
        console.log(e);
        launchToast(e.response?.data as string), "", "destructive";
      })
      .finally(() => setLoading(false));
  }, [user]);

  const onRowSelect = (id: string) => {
    const params = new URLSearchParams({ submissionId: id });
    const submission = data.find((sub) => sub.id === id);
    setCode({ value: submission!.code, enabled: false });
    setLang(submission!.language);
    router.push(pathName + "?" + params.toString());
  };

  return (
    <TabsContent className="p-3" value="submissions">
      {loading || data.length === 0 ? (
        <div className="flex mt-4 items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Submitted On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((submission) => {
              return (
                <TableRow
                  key={submission.id}
                  onClick={() => onRowSelect(submission.id)}
                  className={
                    submissionId === submission.id ? `bg-muted/50` : ``
                  }
                >
                  <TableCell
                    className={`font-medium ${
                      submission.status == "AC"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {submission.status == "AC" ? "Accepted" : "Rejected"}
                  </TableCell>
                  <TableCell>
                    {
                      languages.find((obj) => obj.value === submission.language)
                        ?.label
                    }
                  </TableCell>
                  <TableCell>
                    {format(submission.submittedOn, "do MMM yyyy")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TabsContent>
  );
};

export default ProblemSubmissions;
