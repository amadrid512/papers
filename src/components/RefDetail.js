import React from "react"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"


export function RefDetail(props) {
  return (
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
      {({ setFieldValue, values }) => (
        <Form>
          <div className="form-row">
            <div className="form-group col-md-8">
              <label htmlFor="referenceInput">Reference</label>
              <Field name="REFERENCE" placeholder="Reference" className="form-control" id="referenceInput" value={values.REFERENCE || ""} />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubMonthInput">Pub Month </label>
              <Field name="PUB_MONTH" placeholder="Pub Month " className="form-control" id="pubMonthInput" value={values.PUB_MONTH || ""} />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubYearInput">Pub Year </label>
              <Field name="PUB_YEAR" placeholder="Pub Year " className="form-control" id="pubYearInput" value={values.PUB_YEAR || ""} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-8">
              <label htmlFor="citationInput">Full Citation</label>
              <Field name="FULL_CITATION" placeholder="Full Citation" className="form-control" id="citationInput" value={values.FULL_CITATION || ""} />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubmedIDInput">PubMed ID </label>
              <Field name="PMID" placeholder="PubMed ID" className="form-control" id="pubmedIDInput" value={values.PMID || ""} />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubmedCentralInput">PubMed Central </label>
              <Field name="PUBMED_CENTRAL" placeholder="PubMed Central" className="form-control" id="pubmedCentralInput" value={values.PUBMED_CENTRAL || ""} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="abstractInput">Abstract</label>
              <Field name="ABSTRACT" placeholder="Abstract" className="form-control" id="abstractInput" value={values.ABSTRACT || ""} />
            </div>
          </div>
          <br />
          <Button type="submit" label="Submit" />
        </Form>
      )}
    </Formik>
  )
}

export default RefDetail