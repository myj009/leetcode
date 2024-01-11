"use client";
import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
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

const ProblemSubmissions: React.FC<ProblemProps> = ({ params }) => {
  const [user] = useUserState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SubmissionSchema[]>([]);

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
                <TableRow key={submission.id}>
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
