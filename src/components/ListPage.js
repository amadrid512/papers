import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Link } from "@reach/router"

const crudUrlPapers = `${CRUDURL}/papers`
var isInsert = 'false'

export function ListPage(props) {
  const [data, setData] = React.useState()
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op
  const [nextID, setNextID] = React.useState()

  React.useEffect(() => {
    //query the category data (fires when refreshData is changed)
    if (refreshData) {
      fetch(crudUrlPapers)
        .then(resp => resp.json())
        .then(json => {
          setData(json.sort((a, b) => a.MS_ID > b.MS_ID))
          setNextID(json.reduce((max, row) => (row.MS_ID * 1 > max ? row.MS_ID * 1 : max), 0) + 1)
        })
      setRefreshData(false)
    }
  }, [refreshData])

  async function deleteItem(item) {
    //do delete after confirming its ok
    if (window.confirm("are you sure you want to delete MS" + item.MS_ID + "?")) {
      await doDelete(crudUrlPapers, item)
      setRefreshData(true)
    }
  }

  function actions(rowdata) {
    return (
      <>
        <button className="btn" onClick={() => setEditItem(rowdata)}>
          <FaPencilAlt title="Edit" />
        </button>
        <button className="btn ml-2" onClick={() => deleteItem(rowdata)}>
          <FaTrashAlt title="Delete" />
        </button>
      </>
    )
  }

  if (!data) return "Loading..." //while fetch is getting data, display this message

  return (
    <div className="container">
      <h1>Manuscripts Main Tracking</h1>
      <div style={{ display: "flex" }}>
        <Link className="btn" to={'detailpage/' + nextID}>
          Add New <FaPlus title="Add New Row" />
        </Link>
      </div>

      <DataTable value={data} paginator={true} rows={100} >
        <Column field="MS_ID" header="Manuscript ID"
          body={rowdata => <Link to={'/detailpage/' + rowdata.MS_ID}>{rowdata.MS_ID}</Link>}
          //body={row => <Link to={"detail/" + row.PUB_SID}>{row.PUB_FILENAME}</Link>}
          sortable={true} filter={true} filterPlaceholder="Search" style={{ width: '10%' }} />
        <Column field="TITLE" header="Title" sortable={true} filter={true} filterPlaceholder="Search" style={{ width: '60%' }} />
        {/* <Column field="TITLE" header="Manuscript Title" sortable={true} body={row => row.PUB_PUBLISH_DATE.toLocaleDateString()} /> */}
        <Column header="Keywords" filter={true} filterPlaceholder="Search" style={{ width: '20%' }} />
        {/* <Column header="Actions" sortable={false} body={actions} style={{width:'10%'}} /> */}
      </DataTable>
    </div>
  )
}

export default ListPage