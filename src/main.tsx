import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss"
// 渲染你的 React 组件
const root = createRoot(document.getElementById('root')!);
root.render(<App></App>)