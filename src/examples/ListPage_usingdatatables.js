import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const crudUrl = `${CRUDURL}/papers`

export function ListPage_usingdatatables() {
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

function actions(rowdata){
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
      <h1>Published Papers</h1>
      {editItem && (
        <Dialog header="Paper Detail" visible={true} style={{ width: "75vw" }} modal={true} onHide={() => this.setState({ visible: false })}>
          <EditForm editItem={editItem} doSubmit={doSubmit} cancelEdit={() => setEditItem(null)} />
        </Dialog>
      )}
      <DataTable value={data} paginator={true} rows={100} >
        <Column field="MS_ID" header="Manuscript ID" sortable={true} filter={true} style={{width:'10%'}}/>
        <Column field="TITLE" header="Title" sortable={true} filter={true}style={{width:'60%'}}/>
        {/* <Column field="TITLE" header="Manuscript Title" sortable={true} body={row => row.PUB_PUBLISH_DATE.toLocaleDateString()} /> */}
        <Column header="Actions" sortable={false} body={actions} style={{width:'10%'}} />
      </DataTable>
    </div>
  )
}

function EditForm(props) {
  return (
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
      {() => (
        <Form>
          <div> 
            <label>Manuscript ID</label>
            <Field name="MS_ID" placeholder="Manuscript ID" />
          </div>
          <div>
            <label>Title </label>
            <Field name="TITLE" placeholder="Manuscript Title" />
          </div>
          <div>
            <label>Stage </label>
            <Field name="STAGE_ID" placeholder="Stage ID" />
          </div>
          <div>
            <label>Analytic Stage </label>
            <Field name="ANALYTIC_STAGE" placeholder="Stage ID" />
          </div>
          <div>
            <label>Convener </label>
            <Field name="CONVENER" placeholder="Convener" />
          </div>
          <br />
          <Button type="submit" label="Submit" />
          <Button type="button" label="Cancel" onClick={() => props.cancelEdit()} />
        </Form>
      )}
    </Formik>
  )
}
