import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { basicDark } from "@uiw/codemirror-theme-basic";

import React, { useEffect } from "react";
import { boilerPlateforLanguage } from "@/app/_atoms/boiler-plate";
import { useRecoilValue } from "recoil";

const CodeEditor = ({}) => {
  const boilerPlate = useRecoilValue(boilerPlateforLanguage("javascript"));
  const [value, setValue] = React.useState(boilerPlate?.code || "");
  const onChange = React.useCallback((val: string, viewUpdate: ViewUpdate) => {
    setValue(val);
  }, []);

  useEffect(() => {
    setValue(boilerPlate?.code || "");
  }, [boilerPlate]);

  return (
    <CodeMirror
      value={value}
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
      className="flex-grow"
      height="100%"
      theme={basicDark}
      basicSetup={true}
    />
  );
};

export default CodeEditor;
