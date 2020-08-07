import React from "react"
import { Link } from "react-router-dom"
import MainMenu from "./components/MainMenu"
import ListPage from "./components/ListPage"
import { navigate } from "@reach/router";


export function Home() {
  return (
    <>
    <MainMenu />
    <ListPage />
    </>
  )
}
