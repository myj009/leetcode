import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { basicDark } from "@uiw/codemirror-theme-basic";

import React, { useEffect } from "react";
//import { boilerPlateforLanguage } from "@/app/_atoms/boiler-plate";
import { useRecoilState, useRecoilValue } from "recoil";
import { codeState } from "@/app/_atoms/code";
import { boilerPlateforLanguage } from "@/app/_atoms/problem";
import { LangType } from "@/app/problems/types";
import { languageState } from "@/app/_atoms/language";

const CodeEditor = () => {
  const [code, setCode] = useRecoilState(codeState);
  const language = useRecoilValue(languageState);
  const boilerPlate = useRecoilValue(boilerPlateforLanguage(language));

  // Function to get the appropriate language extension
  const getLanguageExtension = (language: LangType) => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
        return cpp();
      default:
        return [];
    }
  };

  useEffect(() => {
    setCode({ ...code, value: boilerPlate?.code || "" });
  }, [boilerPlate]);

  return (
    <CodeMirror
      value={code.value}
      extensions={[getLanguageExtension(language)]}
      onChange={() => {
        setCode({ ...code, value: boilerPlate?.code || "" });
      }}
      className="flex-grow"
      height="100%"
      theme={basicDark}
      basicSetup={true}
    />
  );
};

export default CodeEditor;
