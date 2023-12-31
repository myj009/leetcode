"use client";
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { ProblemProps, ProblemSchema } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";

const ProblemDescription: React.FC<ProblemProps> = ({ params }) => {
  const { data, loading } = useAxios<ProblemSchema>(
    `/problems/${params.problemId}`
  );
  console.log(params.problemId);
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
    <TabsContent className="p-3" value="description">
      {loading && !data ? (
        <div className="flex mt-4 items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
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
              {data?.level?.charAt(0)?.toUpperCase() + data!.level?.slice(1)}
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
                      <span className="text-muted-foreground">{tc.input}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Output: </span>
                      <span className="text-muted-foreground">{tc.output}</span>
                    </div>
                  </blockquote>
                </div>
              );
            })}
            <div className="text-md font-semibold"></div>
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default ProblemDescription;
