import React from "react"
import { CRUDURL, doDelete, doEdit, doInsert } from "../lib/restHelpers"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from 'primereact/inputtext'
import { Link } from "@reach/router"

import MainMenu from "./MainMenu"
import { TabView, TabPanel } from "primereact/tabview"
import { Col } from "react-bootstrap"



export function AuthorDetail({ data, doSubmit, cancelEdit }) {
  const [authorList, setAuthorlist] = React.useState(data.AUTHORS)
  const [editItem, setEditItem] = React.useState({
    AUTH_ORDER: "",
    AUTH_ID: "",
    LASTNAME: "",
    FIRSTNAME: "",
    EMAIL: ""
  }) //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op

  const crudUrl = `${CRUDURL}/papers`

  async function deleteItem(item) {
    //do delete after confirming its ok
    if (window.confirm("are you sure you want to delete MS" + item.MS_ID + "?")) {
      await doDelete(crudUrl, item)
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

  async function changeAuthor(field, props, value) {
    let updatedAuthors = [...props.value]
    updatedAuthors[props.rowIndex][props.field] = value
    updatedAuthors[props.rowIndex].updated = true

    setAuthorlist(updatedAuthors)

    //setEditItem()
    //this.setState({ [`${productKey}`]: updatedProducts });

    //console.log(newValue, field)
    //setEditItem({ ...editItem, field: newValue })
    //{ MS_ID: id, STUDY_ABBR: studyUpper }
    //await doEdit(`${CRUDURL}/paper_authors`, { [`${field}`]: newValue }).then(resp => setRefreshData(true))
  }

  function inputTextEditor(props, field) {
    return <InputText type="text" value={props.rowData[field]} onChange={(e) => changeAuthor(field, props, e.target.value)} />;
  }

  function nameEditor(props) {
    return inputTextEditor(props, 'LASTNAME');
  }

  function emailEditor(props) {
    return inputTextEditor(props, 'EMAIL');
  }

  function orderEditor(props) {
    return inputTextEditor(props, 'AUTH_ORDER');
  }

  return (
    <div className="container">
      <Formik initialValues={data} onSubmit={doSubmit}>
        {() => (
          <Form>
            <div className="form-row">
              <div className="form-group col-md-3">
                <br></br>
                <div className="form-check">
                  <Field name="NEWAUTHOR" className="form-check-input" id="authorsInput" type="checkbox" />
                  <label className="form-check-label" htmlFor="authorsInput">
                    Lead Author New to WHI
                </label>
                </div>
              </div>
              <div className="form-group col-md-9">
                <br></br>
                <div className="form-check">
                  <Field name="EARLYCAREERAUTHOR" className="form-check-input" id="earlyCareerInput" type="checkbox" />
                  <label className="form-check-label" htmlFor="earlyCareerInput">
                    Early-career Investigator
                </label>
                </div>
              </div>
            </div>
            <br />
          </Form>
        )}
      </Formik>


      <DataTable value={authorList} editMode="cell" className="editable-cells-table">
        <Column field="AUTH_ID" header="ID" style={{ width: '10%' }} > </Column>
        <Column field="LASTNAME" header="Author" style={{ width: '70%' }} editor={(e) => nameEditor(e)}></Column>
        <Column field="EMAIL" header="Email" style={{ width: '40%' }} editor={(e) => emailEditor(e)}></Column>
        <Column field="AUTH_ORDER" header="Order" style={{ width: '10%' }} editor={(e) => orderEditor(e)}></Column>
        <Column header="Actions" sortable={false} body={actions} style={{ width: '20%' }} />

      </DataTable>

      <Button type="submit" label="Submit" />


    </div>
  )
}


export default AuthorDetail