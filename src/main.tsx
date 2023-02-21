import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GlobalContextProvider } from "./GlobalContext/GlobalContext";
import "./index.css";

ReactDOM.render(
   <React.StrictMode>
      <GlobalContextProvider>
         <App></App>
      </GlobalContextProvider>
   </React.StrictMode>,
   document.getElementById("root")
);
