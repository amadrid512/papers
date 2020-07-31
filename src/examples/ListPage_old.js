import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
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
    setEditItem({ MS_ID: -1, PMID: "", TITLE: "", ABSTRACT: "", STAGE_ID: 999, DATA_FOCUS: "", PAPER_FOCUS: "", PAPER_TYPE: "", ISP: "", HIGHPRIORITY: "", CATEGORY: "", ANALYTIC_STAGE: "", PP_PROPOSAL_APPROVAL: "", PP_MANUSCRIPT_APPROVAL: "", PO_APPROVAL: "", WREQCHANGES: "", REFERENCE: "", FULL_CITATION: "", NOTES: "", C_SHARP: "", STATISTICIAN: "", PUBMED_CENTRAL: "", PAID_DATE: "", PUB_MONTH: "", PUB_YEAR: "", ON_HOLD: "", RELATED_STUDIES: "", SIGS: "", LEAD_AUTHOR_NEW_TO_WHI: "", APPROVED_OFF_CALL: "", GRANT_TEXT: "", CONSORTIUM_ID: "", NDI_DATA_USED: "", SPONSORING_PI: "", SUPPLEMENTAL_FORMS_USED: "", EARLY_CAREER_INVESTIGATOR: "", JOURNAL_IMPACT_FACTOR: "", LAST_DML: "", CONVENER: "" })
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
        console.log(crudUrl)
        console.log(values)
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
      <h1>Published Papers</h1>
      {editItem && (
        <Dialog header="Paper Detail" visible={true} style={{ width: "auto" }} modal={true} onHide={() => this.setState({ visible: false })}>
          <EditForm editItem={editItem} doSubmit={doSubmit} cancelEdit={() => setEditItem(null)} />
        </Dialog>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn" onClick={createNewItem}>
          Add New <FaPlus title="Add New Row" />
        </button>
      </div>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Manuscript ID</th>
            <th>Manuscript Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr key={c.MS_ID}>
              <td>{c.MS_ID}</td>
              <td>{c.TITLE}</td>
              <td>
                <button className="btn" onClick={() => setEditItem(c)}>
                  <FaPencilAlt title="Edit" />
                </button>
                <button className="btn ml-2" onClick={() => deleteItem(c)}>
                  <FaTrashAlt title="Delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
