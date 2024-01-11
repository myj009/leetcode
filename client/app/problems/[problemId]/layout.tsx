"use client";
import { useUserState } from "@/app/_atoms/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import customAxios from "@/lib/customAxios";
import { launchToast } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LangType, languages } from "../types";
import CodeEditor from "@/components/code-editor";
import { useRecoilState } from "recoil";
import { languageState } from "@/app/_atoms/language";

type PostSubmissionRes = {
  submission_id: string;
  accepted: boolean;
};

const ProblemLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    problemId: string;
  };
}) => {
  const [language, setLanguage] = useRecoilState(languageState);
  const [code, setCode] = useState("// Write your code here");
  const router = useRouter();
  const [user] = useUserState();
  const pathName = usePathname();

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

  return (
    <div className="p-4 flex flex-grow overflow-y-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border rounded-lg min-w-[720px]"
      >
        <ResizablePanel className="h-full min-w-[400px]">
          <Tabs
            defaultValue={pathName.split("/").pop()}
            className="h-full w-full p-3"
          >
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4">
              <TabsTrigger
                onClick={() =>
                  router.push(`/problems/${params.problemId}/description`)
                }
                value="description"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                onClick={() =>
                  router.push(`/problems/${params.problemId}/submissions`)
                }
                value="submissions"
              >
                Submissions
              </TabsTrigger>
            </TabsList>
            {children}
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="min-w-[400px]">
          <div className="p-2 flex flex-col h-full gap-2">
            <Select
              onValueChange={(newLang: LangType) => setLanguage(newLang)}
              defaultValue={language}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => {
                  return (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <CodeEditor />

            <Card className="p-2 flex justify-end items-center">
              {user ? (
                <Button onClick={submitSolution} className="bg-[#4CC575]">
                  Submit
                </Button>
              ) : (
                <Button onClick={() => router.push("/signin")}>
                  <Lock className="mr-2 h-4 w-4 " />
                  Sign in
                </Button>
              )}
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProblemLayout;
