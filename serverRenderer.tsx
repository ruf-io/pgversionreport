import ReactDOMServer from "react-dom/server";
import App from "./src/components/App";
import { JSDOM } from "jsdom";
import { readFileSync, writeFileSync } from "fs";

const content = ReactDOMServer.renderToString(<App />);

const dom = new JSDOM(readFileSync("dist/index.html", "utf-8"));
dom.window.document.getElementById("app")!.innerHTML = content;
writeFileSync("dist/index.html", dom.serialize());

console.log("Server rendered the App content!");
