import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"

const crudUrl = `${CRUDURL}/F2_CAT/`

export function CategoryCrud() {
  const [data, setData] = React.useState() // holds category rows
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op

  React.useEffect(() => {
    //query the category data (fires when refreshData is changed)
    if (refreshData) {
      fetch(crudUrl)
        .then(resp => resp.json())
        .then(json => setData(json.sort((a, b) => a.QCAT_NAME.localeCompare(b.QCAT_NAME))))
      setRefreshData(false)
    }
  }, [refreshData])

  function createNewItem() {
    //set edit item with a dummy row, -1 for pk col will be replaced later...
    setEditItem({ QCAT_ID: -1, QCAT_NAME: "", QCAT_SHORT_NAME: "" })
  }

  async function deleteItem(item) {
    //do delete after confirming its ok
    if (window.confirm("are you sure you want to delete " + item.QCAT_NAME + "?")) {
      await doDelete(crudUrl, item)
      setRefreshData(true)
    }
  }

  async function doSubmit(values) {
    //do edit or insert when form is submitted
    const isInsert = values.QCAT_ID === -1 //-1 is flag that this is a new row to be inserted
    try {
      if (isInsert) {
        //calc next id
        const max_id = data.reduce((max, row) => (row.QCAT_ID * 1 > max ? row.QCAT_ID * 1 : max), 0)
        values.QCAT_ID = max_id + 1 //next id
        console.log(crudUrl)
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
      <h1>Query Categories</h1>
      <h3>
        <em>This is a real table, go ahead and test insert, editing and deleting on new rows, but leave the old rows as is</em>
      </h3>
      {editItem && <EditForm editItem={editItem} doSubmit={doSubmit} cancelEdit={() => setEditItem(null)} />}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn" onClick={createNewItem}>
          Add New <FaPlus title="Add New Row" />
        </button>
      </div>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Short Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr key={c.QCAT_ID}>
              <td>{c.QCAT_ID}</td>
              <td>{c.QCAT_NAME}</td>
              <td>{c.QCAT_SHORT_NAME}</td>
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
          <Field name="QCAT_NAME" placeholder="Category" />
          <Field name="QCAT_SHORT_NAME" placeholder="Short Name" />
          <Button type="submit" label="Submit" />
          <Button type="button" label="Cancel" onClick={() => props.cancelEdit()} />
        </Form>
      )}
    </Formik>
  )
}
