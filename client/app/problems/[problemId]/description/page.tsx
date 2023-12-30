"use client";
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAxios from "@/hooks/useAxios";
import { Loader2 } from "lucide-react";
import { Problem } from "../../types";

type ProblemProps = {
  params: {
    problemId: string;
  };
};

const Problem: React.FC<ProblemProps> = ({ params }) => {
  const { data, loading } = useAxios<Problem>(`/problems/${params.problemId}`);
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
        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
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
        </div>
      )}
    </TabsContent>
  );
};

export default Problem;
