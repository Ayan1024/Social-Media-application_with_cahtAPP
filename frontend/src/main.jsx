import { Provider } from "./components/ui/provider"; // your chakra provider wrapper
import { ColorModeProvider } from "./components/ui/color-mode";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RecoilRoot>
    <BrowserRouter>
      <Provider>
        <ColorModeProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ColorModeProvider>
      </Provider>
    </BrowserRouter>
  </RecoilRoot>
  // </React.StrictMode>
);
