"use client";
import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { ProblemProps } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { launchToast } from "@/lib/utils";
import { ProblemSchema, problemState } from "@/app/_atoms/problem";
import { codeState } from "@/app/_atoms/code";
import { Card } from "@/components/ui/card";
import { submissionState } from "@/app/_atoms/submission";
import { axiosInstance } from "@/lib/customAxios";

const ProblemDescription: React.FC<ProblemProps> = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useRecoilState(problemState);
  const [code, setCode] = useRecoilState(codeState);
  const submission = useRecoilValue(submissionState);
  // const setBoilerPlate = useSetRecoilState(boilerPlateAtom);
  // const bpProblemId = useRecoilValue(boilerPlateProblemId);

  useEffect(() => {
    setCode({ ...code, enabled: true });
    if (Number(params.problemId) === data?.id) {
      return;
    }

    setLoading(true);
    axiosInstance
      .get(`/problems/${params.problemId}`)
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw Error(res.data as string);
        }

        const data = res.data as ProblemSchema;
        data.testCases = JSON.parse(res.data.testCases);
        setData(data);
      })
      .catch((err) => {
        const e = err as AxiosError;
        console.log(e);
        launchToast(e.response?.data as string), "", "destructive";
      })
      .finally(() => setLoading(false));
  }, []);
  // const [desc, setDesc] = useState("")
  // const descRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const parseDesc = async () => {
  //     if (!data) {
  //       return;
  //     }
  //     const parsedDesc = await marked.parse(data!.description);
  //     setDesc(parsedDesc)
  //   };
  //   parseDesc();
  // }, [data?.description]);

  return (
    <TabsContent className="p-3 overflow-y-auto" value="description">
      {loading && !data ? (
        <div className="flex mt-4 items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h4 className="scroll-m-20 mb-4 text-xl font-semibold">{`${data?.id}. ${data?.title}`}</h4>
              <p
                className={`${
                  data?.level === "hard"
                    ? "text-red-500"
                    : data?.level === "easy"
                    ? "text-green-500"
                    : data?.level === "medium"
                    ? "text-orange-500"
                    : "text-green-500"
                }`}
              >
                {data
                  ? data.level?.charAt(0)?.toUpperCase() + data.level?.slice(1)
                  : ""}
              </p>
            </div>
            <div>{data?.description}</div>
            <div className="">
              {data?.testCases.map((tc, i) => {
                return (
                  <div key={i} className="mt-2">
                    <div className="font-bold">Example {i + 1}</div>
                    <blockquote>
                      <div>
                        <span className="font-semibold">Input: </span>
                        <span className="text-muted-foreground">
                          {tc.input}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Output: </span>
                        <span className="text-muted-foreground">
                          {tc.output}
                        </span>
                      </div>
                    </blockquote>
                  </div>
                );
              })}
              <div className="text-md font-semibold"></div>
            </div>
          </div>
          {submission && submission.logs !== "" && (
            <div className="flex flex-col overflow-clip">
              <p className="flex text-red-700 font-bold text-lg tracking-wider">
                Error
              </p>
              <Card className="flex bg-[#3A2A2B] mb-4 h-32 ">
                {submission.logs}
              </Card>
            </div>
          )}
        </div>
      )}
    </TabsContent>
  );
};

export default ProblemDescription;
