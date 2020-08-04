import React from "react"
import { useParams } from "react-router-dom"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { CRUDURL, fetchJson,doInsert, doEdit } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"


const crudUrl = `${CRUDURL}/papers`

export function DetailPage(props) {
  const { id } = useParams()
  const [data, setData] = React.useState()
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op

  React.useEffect(() => {
    fetchJson(`${CRUDURL}/papers?MS_ID=${props.MS_ID}`).then(json => setData(json[0]))
  }, [data])

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

  if (!data) return "Loading..."

  return (
    <div className="container">
      <h1>Paper Detail</h1>
      <h3>{data.MS_ID}</h3>
      {/* {editItem && <EditForm editItem={editItem} doSubmit={doSubmit} cancelEdit={() => setEditItem(null)} />} */}
{/*       <Formik initialValues={{ ...data.editItem }} onSubmit={data.doSubmit}>
    {() => (
      <Form>
        <div className="form-row">   
          <div className="form-group col-md-2">
            <label htmlFor="msIDInput">Manuscript ID</label>
            <Field name="MS_ID" placeholder="Manuscript ID" className="form-control" id="msIDInput" />
          </div>
          <div className="form-group col-md-10">
            <label htmlFor="titleInput">Title </label>
            <Field name="TITLE" placeholder="Manuscript Title" className="form-control" id="titleInput"/>
          </div>
        </div>
        </Form>
    )}</Formik>
 */}

{/*        <DataTable value={data}>
        <Column field="MS_ID" header="MS ID" />
        <Column field="TITLE" header="Title" />
      </DataTable>
 */}     </div>
  )
}

function EditForm(props) {
  return(
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
    {() => (
      <Form>
        <div className="form-row">   
          <div className="form-group col-md-2">
            <label htmlFor="msIDInput">Manuscript ID</label>
            <Field name="MS_ID" placeholder="Manuscript ID" className="form-control" id="msIDInput" />
          </div>
          <div className="form-group col-md-10">
            <label htmlFor="titleInput">Title </label>
            <Field name="TITLE" placeholder="Manuscript Title" className="form-control" id="titleInput"/>
          </div>
        </div>
        </Form>
    )}</Formik>

  )
}
