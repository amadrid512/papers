import React from "react"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Link } from "@reach/router"

import MainMenu from "./MainMenu"
import { TabView, TabPanel } from "primereact/tabview"
import { Col } from "react-bootstrap"



export function AuthorDetail(props) {
  return (
    <div className="container">
      <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
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

      <DataTable>
        <Column header="ID" style={{ width: '20%' }} > </Column>
        <Column header="Author" style={{ width: '60%' }} ></Column>
        <Column header="Order" style={{ width: '20%' }} ></Column>
      </DataTable>

      <Button type="submit" label="Submit" />


    </div>
  )
}


export default AuthorDetail