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
  const [filteredAuthors, setFilteredAuthors] = React.useState()
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
    console.log(authorList.length)
    setAuthorlist(authorList.concat({
      AUTH_ORDER: authorList.length + 1,
      AUTH_ID: "",
      FULLNAME: "",
      EDIT_STATUS: "A"
    }))
  }

  async function deleteItem(item, props) {
    //do delete after confirming its ok
    let updatedAuthors = [...props.value]
    updatedAuthors[props.rowIndex]['EDIT_STATUS'] = 'D'
    setAuthorlist(updatedAuthors)
  }

  function actions(rowdata, props) {
    return (
      <>
        <button className="btn ml-2" onClick={() => deleteItem(rowdata, props)}>
          <FaTrashAlt title="Delete" />
        </button>
      </>
    )
  }

  async function changeAuthor(props, value) {
    let updatedAuthors = [...props.value]

    if (value.AUTH_ID) {
      updatedAuthors[props.rowIndex]['AUTH_ID'] = value.AUTH_ID
      updatedAuthors[props.rowIndex]['FULLNAME'] = value.AUTHOR
      updatedAuthors[props.rowIndex]['EDIT_STATUS'] = 'E'
    } else {
      updatedAuthors[props.rowIndex]['AUTH_ID'] = null
      updatedAuthors[props.rowIndex]['FULLNAME'] = value
      updatedAuthors[props.rowIndex]['EDIT_STATUS'] = 'E'
    }

    setAuthorlist(updatedAuthors)
  }

  function searchAuthors(event) {
    setTimeout(() => {
      let results = alphaAuthors.filter(author => {
        return author.AUTHOR.toLowerCase().includes(event.query.toLowerCase());
      });

      setFilteredAuthors(results)
    }, 250);
  }


  function inputTextEditor(props, field) {
    console.log(props.rowData.FULLNAME)
    return (
      //<InputText type="text" value={props.rowData.FULLNAME} onChange={(e) => changeAuthor(field, props, e.target.value)} />
      <AutoComplete value={props.rowData.FULLNAME}
        suggestions={alphaAuthors.AUTHOR}
        completeMethod={searchAuthors}
        field="AUTHOR"
        multiple={true}
        onChange={(e) => changeAuthor(field, props, e.target.value)} />
    )

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

      <DataTable value={authorList.filter(author => author.EDIT_STATUS !== 'D')} editMode="cell" className="editable-cells-table">

        <Column field="FULLNAME" header="Author" style={{ width: '80%' }}
          body={(rowData, props) => {
            return (
              <AutoComplete value={rowData.FULLNAME}
                suggestions={filteredAuthors}
                completeMethod={searchAuthors}
                field="AUTHOR"
                onChange={(e) => changeAuthor(props, e.target.value)} />)
          }}>
        </Column>
        <Column field="AUTH_ORDER" header="Order" style={{ width: '10%' }} editor={(e) => orderEditor(e)}></Column>
        <Column sortable={false} body={actions} style={{ width: '10%' }} />

      </DataTable>

      <Button type="submit" label="Submit" className="p-button-raised" />

    </div>
  )

}


export default AuthorDetail