import React from "react"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"

import MainMenu from "./MainMenu"
import { TabView, TabPanel } from "primereact/tabview"



export function AuthorDetail(props) {
  return (
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
      {() => (
        <Form>
          <div className="form-row">
            <div className="form-group col-md-8">
              <label htmlFor="authorsInput">List of Authors</label>
              <Field name="AUTHORS" placeholder="List of Authors [Array]" className="form-control" id="authorsInput" />
            </div>
            <div className="form-group col-md-2">
              <br></br>
              <div className="form-check">
                <Field name="NEWAUTHOR" className="form-control-sm form-check-input" id="authorsInput" type="checkbox" />
                <label className="form-check-label" htmlFor="newAuthorInput">
                  Lead Author <br></br>New to WHI
                </label>
              </div>
            </div>
            <div className="form-group col-md-2">
              <br></br>
              <div className="form-check">
                <Field name="EARLYCAREERAUTHOR" className="form-control-sm form-check-input" id="earlyCareerInput" type="checkbox" />
                <label className="form-check-label" htmlFor="earlyCareerInput">
                  Early-career <br></br>investigator
                </label>
              </div>
            </div>
          </div>
          <br />
          <Button type="submit" label="Submit" />
        </Form>
      )}
    </Formik>
  )
}


export default AuthorDetail