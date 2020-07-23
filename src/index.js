import React from "react"
import ReactDOM from "react-dom"

import "primereact/resources/themes/nova-light/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

import { App } from "./examples/App"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
