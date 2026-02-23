import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./components/App";
import AppSpeechToText from "./components/AppSpeechToText";

export function render() {
  const html = renderToString(
    <StrictMode>
      {/* <App /> */}
      <AppSpeechToText />
    </StrictMode>,
  );
  return { html };
}
