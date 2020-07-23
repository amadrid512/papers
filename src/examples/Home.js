import React from "react"
import { Link } from "react-router-dom"

export function Home() {
  return (
    <div className="Container">
      <h1>WHI ​Publications and Paper Proposals</h1>
      <ul>
        <li>
          <Link to="/listpage">Published Papers</Link>
        </li>
        <li>
          <Link to="/crudRestDemo">Rest Crud Demo</Link>
        </li>
        <li>
          <Link to="/categories">Query Category Crud page</Link>
        </li>
      </ul>
    </div>
  )
}
