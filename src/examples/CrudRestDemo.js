import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete } from "../lib/restHelpers"

export function CrudRestDemo() {
  return (
    <div className="container">
      <h1>Demo crud operations</h1>
      <h2 style={{ color: "red" }}>Code runs in the console, so open developer tools to see the output</h2>
      <h2 className="mt-4">Using Plain ol' Javascript (fetch)</h2>
      <div>
        <button onClick={doCrudops}>Do Crud Operations</button>
      </div>
      <h2 className="mt-4">Same thing using our RestHelper helper functions to save some typing (and some extra stuff)</h2>
      <div>
        <button onClick={restHelpersCrudops}>Do Crud Operations</button>
      </div>
    </div>
  )

  async function queryTable() {
    const data = await fetch("https://appccc.whi.org/api/CRUD/F2_CAT").then(resp => resp.json())
    console.log(data)
  }

  async function doCrudops() {
    console.log("First we'll show the data currently in the table...")
    await queryTable()

    //Create an object that matches table columns
    let item = { QCAT_ID: 14, QCAT_NAME: "Test", QCAT_SHORT_NAME: "Test" }

    // INSERT
    console.log("do insert")

    await fetch("https://appccc.whi.org/api/CRUD/F2_CAT", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item)
    })

    await queryTable()

    // UPDATE
    console.log("Do Edit")

    item.QCAT_NAME = "Testing edit" //make a change to the object

    await fetch("https://appccc.whi.org/api/CRUD/F2_CAT", {
      method: "put",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item)
    })

    await queryTable()

    //DELETE
    console.log("do delete")
    await fetch("https://appccc.whi.org/api/CRUD/F2_CAT", {
      method: "delete",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item)
    })

    await queryTable()
  }

  async function restHelpersCrudops() {
    console.log("With RestHelper functions...")
    await queryTable()

    //Create an object that matches table columns
    let item = { QCAT_ID: 14, QCAT_NAME: "Test", QCAT_SHORT_NAME: "Test" }

    // INSERT
    console.log("do insert")
    await doInsert(`${CRUDURL}/F2_CAT`, item)
    await queryTable()

    // UPDATE
    console.log("Do Edit")

    item.QCAT_NAME = "Testing edit" //make a change to the object

    await doEdit(`${CRUDURL}/F2_CAT`, item)
    await queryTable()

    //DELETE
    console.log("do delete")
    await doDelete(`${CRUDURL}/F2_CAT`, item)
    await queryTable()
  }
}
