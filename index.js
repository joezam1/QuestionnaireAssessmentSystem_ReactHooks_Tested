import React from "react";
import ReactDOM from "react-dom/client";

import App from './src/App.js';
import TargetHtmlElementId from './src/services/stringLiterals/TargetHtmlElementId.js';


console.log("PROCESS.ENV.NODE_ENV: ", process.env.NODE_ENV); // This prints "development"
console.log("PROCESS.ENV.PUBLIC_URL: ", process.env); // This prints "my-site"
const root = ReactDOM.createRoot(document.getElementById(TargetHtmlElementId.ROOT));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
