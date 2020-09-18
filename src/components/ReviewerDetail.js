import React from "react"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"

export function ReviewerDetail(props) {
  return (
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
      {() => (
        <Form>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="propReviewer1Input">Proposal Reviewer 1</label>
              <Field name="PROPREVIEWER1" placeholder="Proposal Reviewer 1" className="form-control" id="propReviewer1Input" />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="propReviewer2Input">Proposal Reviewer 2</label>
              <Field name="PROPREVIEWER2" placeholder="Proposal Reviewer 2" className="form-control" id="propReviewer2Input" />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="propAgendaDatesInput">Agenda Dates Proposal</label>
              <Field name="AGENDADATESPROP" placeholder="Agenda Dates Proposal" className="form-control" id="propAgendaDatesInput" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="manReviewer1Input">Manuscript Reviewer 1</label>
              <Field name="MANREVIEWER1" placeholder="Manuscript Reviewer 1" className="form-control" id="manReviewer1Input" />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="manReviewer2Input">Manuscript Reviewer 2</label>
              <Field name="MANREVIEWER2" placeholder="Manuscript Reviewer 2" className="form-control" id="manReviewer2Input" />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="manAgendaDatesInput">Agenda Dates Manuscript</label>
              <Field name="AGENDADATESMAN" placeholder="Agenda Dates Manuscript" className="form-control" id="manAgendaDatesInput" />
            </div>
          </div>
          <br />
          <Button type="submit" label="Submit" />
        </Form>
      )}
    </Formik>
  )
}

export default ReviewerDetail