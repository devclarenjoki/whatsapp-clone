import React, { useContext, useEffect } from "react";
import Home from "./screens/Home/Home";
import { ContextProvider } from "./context/Context";

const App = () => {
  return (
    <ContextProvider>
      <Home />
    </ContextProvider>
  );
};
export default App;
