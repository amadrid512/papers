import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const crudUrl = `${CRUDURL}/papers`

export function ListPage() {
  const [data, setData] = React.useState()
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op

  React.useEffect(() => {
    //query the category data (fires when refreshData is changed)
    if (refreshData) {
      fetch(crudUrl)
        .then(resp => resp.json())
        .then(json => setData(json.sort((a, b) => a.MS_ID > b.MS_ID)))
      setRefreshData(false)
    }
  }, [refreshData])

  function createNewItem() {
    //set edit item with a dummy row, -1 for pk col will be replaced later...
    setEditItem({ MS_ID: -1, PMID: "", TITLE: "" })
  }

  async function deleteItem(item) {
    //do delete after confirming its ok
    if (window.confirm("are you sure you want to delete " + item.PMID + "?")) {
      await doDelete(crudUrl, item)
      setRefreshData(true)
    }
  }

  async function doSubmit(values) {
    //do edit or insert when form is submitted
    const isInsert = values.MS_ID === -1 //-1 is flag that this is a new row to be inserted
    try {
      if (isInsert) {
        //calc next id
        const max_id = data.reduce((max, row) => (row.MS_ID * 1 > max ? row.MS_ID * 1 : max), 0)
        values.MS_ID = max_id + 1 //next id

        await doInsert(crudUrl, values).then(resp => resp.json())
      } else {
        await doEdit(crudUrl, values).then(resp => resp.json())
      }

      setRefreshData(true) //fire off a requery of the page after the insert/update
    } catch (error) {
      alert("Something went wrong")
    }
    setEditItem(null) //clear edit item so edit form dissapears
  }

  if (!data) return "Loading..." //while fetch is getting data, display this message

  return (
    <div className="container">
      <h1>Papers</h1>
      <DataTable value={data}>
        <Column field="MS_ID" header="Manuscript ID" sortable={true} />
        <Column field="PMID" header="PMID" sortable={true} />
        {/* <Column field="PMID" header="PMID" sortable={true} body={row => <Link to={"detail/" + row.PUB_SID}>{row.PUB_FILENAME}</Link>} /> */}
        <Column field="TITLE" header="Manuscript Title" sortable={true} />
        {/* <Column field="TITLE" header="Manuscript Title" sortable={true} body={row => row.PUB_PUBLISH_DATE.toLocaleDateString()} /> */}
        <Column
          field="ACTIONS"
          header="Actions"
          sortable={false}
          body={record => {
            return (
              // <Fragment>
                <button className="btn btn-primary btn-sm" onClick={() => this.editRecord(record)}>
                  <i className="fa fa-edit"></i>
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => this.deleteRecord(record)}>
                  <i className="fa fa-trash"></i>
                </button>
              // </Fragment>
            )
          }}
        />
      </DataTable>
    </div>
  )
}
