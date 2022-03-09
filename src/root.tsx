import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";

const Root = () => {
  return (
    <>
      <App />
    </>
  );
};

export default Root;

ReactDOM.render(<Root />, document.getElementById("root"));
