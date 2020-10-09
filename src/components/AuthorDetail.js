import React from "react"
import { CRUDURL, doDelete, doEdit, doInsert } from "../lib/restHelpers"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from 'primereact/inputtext'
import { AutoComplete } from 'primereact/autocomplete';
import { Link } from "@reach/router"


export function AuthorDetail({ data, alphaAuthors, doSubmit, cancelEdit }) {
  const [authorList, setAuthorlist] = React.useState(data.AUTHORS)
  const [editItem, setEditItem] = React.useState({
    AUTH_ORDER: "",
    AUTH_ID: "",
    LASTNAME: "",
    FIRSTNAME: "",
    EMAIL: "",
    FULLNAME: ""
  }) //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op

  const crudUrl = `${CRUDURL}/papers`
  const paperAuthorsURL = `${CRUDURL}/paper_authors`

  function addAuthorToPaper() {
    //await doInsert(paperAuthorsURL, { MS_ID: data.MS_ID, AUTH_ID: '', LASTNAME: '', AUTH_ORDER: '' }).then(() => setRefreshData(true))
    console.log(authorList.length)
    setAuthorlist(authorList.concat({
      AUTH_ORDER: authorList.length + 1,
      AUTH_ID: "",
      LASTNAME: "",
      FIRSTNAME: "",
      EMAIL: "",
      FULLNAME: ""
    }))
  }

  async function deleteItem(item) {
    //do delete after confirming its ok
    if (window.confirm("Are you sure you want to delete this author" + item.MS_ID + "?")) {
      await doDelete(crudUrl, item)
      setRefreshData(true)
    }
  }

  function actions(rowdata) {
    return (
      <>
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
  }

  function searchAuthors(event) {
    console.log(alphaAuthors[0])
    setTimeout(() => {
      let filteredAuthors;
      if (!event.query.trim().length) {
        filteredAuthors = [...alphaAuthors];
      }
      else {
        filteredAuthors = alphaAuthors.filter((AUTHOR) => {
          return alphaAuthors.AUTHOR.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setAuthorlist({ filteredAuthors });
    }, 250);
  }

  function inputTextEditor(props, field) {
    console.log(props.rowData.FULLNAME)
    return (
      //<InputText type="text" value={props.rowData.FULLNAME} onChange={(e) => changeAuthor(field, props, e.target.value)} />
      <AutoComplete value={props.rowData.FULLNAME} suggestions={alphaAuthors.AUTHOR} completeMethod={searchAuthors} field="name" multiple onChange={(e) => changeAuthor(field, props, e.target.value)} />
    )

  }

  function nameEditor(props) {
    return inputTextEditor(props, 'FULLNAME');
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

      <button className="btn ml-2" onClick={addAuthorToPaper} >
        Add Author <FaPlus title="Add" label="Add Author" />
      </button>

      <DataTable value={authorList} editMode="cell" className="editable-cells-table">

        <Column field="FULLNAME" header="Author" style={{ width: '80%' }} editor={(e) => nameEditor(e)}>
          {/* <AutoComplete value={authorList.FULLNAME} suggestions={alphaAuthors.AUTHOR} completeMethod={""} field="name" multiple onChange={""} /> */}
        </Column>
        <Column field="AUTH_ORDER" header="Order" style={{ width: '10%' }} editor={(e) => orderEditor(e)}></Column>
        <Column sortable={false} body={actions} style={{ width: '10%' }} />

      </DataTable>

      <Button type="submit" label="Submit" className="p-button-raised" />

    </div>
  )

}


export default AuthorDetail