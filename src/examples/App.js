import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import { Home } from "./Home"
import { ListPage } from "./ListPage"
import { ListPage_usingdatatables } from "./ListPage_usingdatatables"
import { DetailPage } from "./DetailPage"
import { CrudRestDemo } from "./CrudRestDemo"
import { CategoryCrud } from "./CatCrud"

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/detail/:id">
          <DetailPage />
        </Route>
        <Route exact path="/listpage">
          <ListPage />
        </Route>
        <Route exact path="/listpage_usingdatatables">
          <ListPage_usingdatatables />
        </Route>
        <Route exact path="/crudRestDemo">
          <CrudRestDemo />
        </Route>
        <Route exact path="/categories">
          <CategoryCrud />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
