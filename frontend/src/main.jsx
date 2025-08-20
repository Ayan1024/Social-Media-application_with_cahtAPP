import { Provider } from "./components/ui/provider"; // your chakra provider wrapper
import { ColorModeProvider } from "./components/ui/color-mode";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Provider>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </Provider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
