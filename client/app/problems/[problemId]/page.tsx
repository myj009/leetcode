"use client";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { Loader2, Lock } from "lucide-react";
import { Problem } from "../types";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "@/app/_atoms/user";
import customAxios from "@/lib/customAxios";
import { launchToast } from "@/lib/utils";

type ProblemProps = {
  params: {
    problemId: string;
  };
};

type PostSubmissionRes = {
  submission_id: string;
  accepted: boolean;
};

const Problem: React.FC<ProblemProps> = ({ params }) => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const { data, loading } = useAxios<Problem>(`/problems/${params.problemId}`);
  const descRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const user = useRecoilValue(userState);

  const submitSolution = async () => {
    const res = await customAxios<PostSubmissionRes>(
      `/submissions/${params.problemId}`,
      "post",
      {
        lang: language,
        code,
      },
      {
        Authorization: user?.token,
      }
    );
    if (res?.accepted) {
      launchToast("Submission Accepted", "", "success");
    } else {
      launchToast("Submission Rejected", "", "destructive");
    }
  };

  useEffect(() => {
    const parseDesc = async () => {
      if (!data) {
        return;
      }
      const parsedDesc = await marked.parse(data!.description);
      if (descRef.current) {
        descRef.current.innerHTML = parsedDesc;
      }
    };
    parseDesc();
  }, [data?.description]);

  return (
    <div className="p-4 flex flex-grow overflow-y-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border rounded-lg"
      >
        <ResizablePanel className="h-full">
          <Tabs defaultValue="description" className="h-full w-full p-3">
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>
            <TabsContent className="p-3 h-full" value="description">
              {loading && !data ? (
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
              ) : (
                <ScrollArea>
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
                        {data?.level?.charAt(0)?.toUpperCase() +
                          data!.level?.slice(1)}
                      </p>
                    </div>
                    <div ref={descRef} />
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent className="p-3" value="submissions">
              Change your password here.
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="p-2 flex flex-col h-full gap-2">
            <Select
              onValueChange={(newLang) => setLanguage(newLang)}
              defaultValue={language}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Write your code here"
              className="flex-grow bg-secondary"
              onChange={(e) => {
                setCode(e.target.value);
              }}
              value={code}
            />

            <Card className="p-2 flex justify-end items-center">
              {user ? (
                <Button onClick={submitSolution} className="bg-[#4CC575]">
                  Submit
                </Button>
              ) : (
                <Button onClick={() => router.push("/signin")}>
                  <Lock className="mr-2 h-4 w-4 " />
                  Login
                </Button>
              )}
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Problem;
