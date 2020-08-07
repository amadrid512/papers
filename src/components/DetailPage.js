import React from "react"
import { useParams } from "@reach/router"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Button } from "primereact/button"
import { Link } from "@reach/router"
import { IconName, FiHome } from "react-icons/fi"
import MainMenu from "./MainMenu"


export function DetailPage() {
  const { id } = useParams()
  const [data, setData] = React.useState()
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op
  const [isInsert, setIsInsert] = React.useState(false)
  React.useEffect(() => {
    fetchJson(`${QUERYURL}/papers?id=${id}`).then(json => {
      if (json.length>0) { 
        setData(json[0]) 
        setIsInsert(false)
      } else {
        setData({ MS_ID: id, PMID: "", TITLE: "", STAGE_ID: "0"})
        setIsInsert(true)
      }
    })
  }, [id])

  async function doSubmit(values) {
    //do edit or insert when form is submitted
    try {
      if (isInsert) {
        //calc next id
        await doInsert(`${CRUDURL}/papers`, values).then(resp => resp.json())
      } else {
        await doEdit(`${CRUDURL}/papers`, values).then(resp => resp.json())
      }
  
      setRefreshData(true) //fire off a requery of the page after the insert/update
    } catch (error) {
      alert("Something went wrong")
    }
    setEditItem(null) //clear edit item so edit form dissapears
     alert('MS-' + values.MS_ID + ' has been SAVED')
   }
  
  //if (!data) return "Loading..."

  return (
    <>
    <MainMenu />
    <div className="container">
      <h1>Paper Detail</h1>
      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}> */}
      <div style={{ display: "flex" }}>
        <Link  to={'/listpage'}>
          <FiHome title="Manuscripts Home"/> Manuscripts Home
        </Link>
      </div>
      <br></br>
      {data && (
          <EditForm editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />
          )}
    </div>
    </>
    )

}

function EditForm(props) {
  return (
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

          <div className="form-row">             
            <div className="form-group col-md-4">
              <label htmlFor="stageInput" >Stage</label>
              <Field as="select" name="STAGE_ID" placeholder="Stage ID" className="form-control" id="stageInput">
                <option value="0"	label="0 Proposal submitted"/>
                <option value="1" label="1	Assigned to reviewers"/>
                <option value="2" label="2	Approved/Writing Group nominations open"></option>
                <option value="3" label="3	Writing group approved"></option>
                <option value="4" label="4	Analysis proposed"></option>
                <option value="5" label="5	Analysis in progress"></option>
                <option value="6" label="6	Analysis completed"></option>
                <option value="7" label="7	Draft manuscript"></option>
                <option value="8" label="8	Final ms submitted to P and P and PO"></option>
                <option value="9" label="9	Final ms approved"></option>
                <option value="10" label="10	Submitted"></option>
                <option value="11" label="11	In press"></option>
                <option value="12" label="12	Published"></option>
                <option value="13" label="13	Inactive (investigator)"></option>
                <option value="14" label="14	Master's thesis; not for pub."></option>
                <option value="15" label="15	On hold"></option>
                <option value="16" label="16	Waiting for data"></option>
                <option value="86" label="86	Dropped"></option>
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="analyticStageInput" >Analytic Stage </label>
              <Field as="select" name="ANALYTIC_STAGE" placeholder="Analytic Stage" className="form-control" id="analyticStageInput">
                <option value="" label="Analytic Stage"></option>
                <option value="1" label="1 Proposal approved"></option>
                <option value="2" label="2 Statistician assigned"></option>
                <option value="3" label="3 Data requested (if necessary)"></option>
                <option value="4" label="4 Data file created"></option>
                <option value="5" label="5 Data definitions"></option>
                <option value="6" label="6 Initial analysis (variables, descriptives, graphs)"></option>
                <option value="7" label="7 Later analysis (multivariate, modeling)"></option>
                <option value="8" label="8 Analyses complete"></option>
                <option value="9" label="9 Stat methods section written"></option>
                <option value="10" label="10 Statistician received draft"></option>
                <option value="11" label="11 Edits of final manuscript to chair"></option>
                <option value="12" label="12 Waiting for data"></option>
                <option value="13" label="13 Re-run analyses"></option>
                <option value="14" label="14 Answer reviewer's comments/questions"></option>
                <option value="85" label="85 Data file created and sent out"></option>
                <option value="86" label="86 Dropped"></option>
              </Field>             
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="convenerInput" >Convener </label>
              <Field name="CONVENER" placeholder="Convener" className="form-control" id="convenerInput"/>
            </div>
          </div>

          <div className="form-row">   
            <div className="form-group col-md-4">
              <label htmlFor="authorsInput">List of Authors</label>
              <Field name="AUTHORS" placeholder="List of Authors [Array]" className="form-control" id="authorsInput" />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="paperTypeInput">Paper Type </label>
              <Field as="select" name="PAPER_TYPE" placeholder="Paper Type" className="form-control" id="paperTypeInput">
                <option value="" label="Paper Type"></option>
                <option value="1" label="Group-authored"></option>
                <option value="2" label="Individual authors"></option>
                <option value="3" label="Local publication"></option>
                <option value="4" label="WHIMS"></option>
                <option value="5" label="Thesis"></option>
                <option value="6" label="Collaborative"></option>
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="categoryInput">Category </label>
              <Field as="select" name="CATEGORY" placeholder="Category" className="form-control" id="categoryInput">
                <option value="" label="Category"></option>
                <option value="1" label="Peer-reviewed"></option>
                <option value="2" label="Editorials and other"></option>
                <option value="9" label="Undecided"></option>
              </Field>
            </div>
          </div>

          <div className="form-row">   
            <div className="form-group col-md-4">
              <label htmlFor="relatedPapersInput">Related Papers</label>
              <Field name="RELATED_PAPERS" placeholder="Related Papers (Mark All)" className="form-control" id="relatedPapersInput" />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consortiumIDInput">Consortium </label>
              <Field name="CONSORTIUM_ID" placeholder="Consortium" className="form-control" id="consortiumIDInput"/>
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="proposalApprovalInput">PP Proposal Approval</label>
              <Field name="PP_PROPOSAL_APPROVAL" placeholder="PP Proposal Approval" className="form-control" id="proposalApprovalInput"/>
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="manApprovalInput">PP Paper Approval </label>
              <Field name="PP_MANUSCRIPT_APPROVAL" placeholder="PP Paper Approval" className="form-control" id="manApprovalInput"/>
            </div>
          </div>

          <div className="form-row">   
            <div className="form-group col-md-8">
              <label htmlFor="referenceInput">Reference</label>
              <Field name="REFERENCE" placeholder="Reference" className="form-control" id="referenceInput" />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubMonthInput">Pub Month </label>
              <Field name="PUB_MONTH" placeholder="Pub Month " className="form-control" id="pubMonthInput"/>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubYearInput">Pub Year </label>
              <Field name="PUB_YEAR" placeholder="Pub Year " className="form-control" id="pubYearInput"/>
            </div>
          </div>

          <div className="form-row">   
            <div className="form-group col-md-8">
              <label htmlFor="citationInput">Full Citation</label>
              <Field name="FULL_CITATION" placeholder="Full Citation" className="form-control" id="citationInput" />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubmedIDInput">PubMed ID </label>
              <Field name="PMID" placeholder="PubMed ID" className="form-control" id="pubmedIDInput"/>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pubmedCentralInput">PubMed Central </label>
              <Field name="PUBMED_CENTRAL" placeholder="PubMed Central" className="form-control" id="pubmedCentralInput"/>
            </div>
          </div>

          <div className="form-row">   
            <div className="form-group col-md-12">
              <label htmlFor="abstractInput">Abstract</label>
              <Field name="ABSTRACT" placeholder="Abstract" className="form-control" id="abstractInput" />
            </div>
          </div>
          <br />
          <Button type="submit" label="Submit" />
          {/* <Button type="button" className="p-button-secondary" label="Cancel" onClick={() => props.cancelEdit()} /> */}

        </Form>
      )}
      </Formik>
    )
  }
  
  export default DetailPage