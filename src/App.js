import React from "react"
//import { BrowserRouter, Switch, Route } from "react-router-dom"
import { Router } from "@reach/router";

import { Home } from "./Home"
import { ListPage } from "./components/ListPage"
import { DetailPage } from "./components/DetailPage"

export function App() {
  return (
    <Router>
      <Home path="/" />
      <ListPage path="/listpage" />
      <DetailPage path="/detailpage/:id" />

    </Router>
  )
}
