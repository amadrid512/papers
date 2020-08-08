import React from "react"
import { useParams } from "@reach/router"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Button } from "primereact/button"
import { Link } from "@reach/router"
import { IconName, FiHome } from "react-icons/fi"
import MainMenu from "./MainMenu"
import {TabView,TabPanel} from 'primereact/tabview'


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
    <TabView>
      <TabPanel header="Paper Detail"> 
        <div className="container">
        {data && (
            <EditPaper editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />
            )}
        </div>
      </TabPanel>
      <TabPanel header="Author List"> 
        <div className="container">
          {data && (
              <EditAuthors editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />
              )}
          </div>
      </TabPanel>
      <TabPanel header="Reviewer Tracking"> 
        <div className="container">
          {data && (
              <EditReviewers editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />
              )}
          </div>
      </TabPanel>
      <TabPanel header="Reference Detail"> 
        <div className="container">
          {data && (
              <EditRef editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />
              )}
          </div>
      </TabPanel>
    </TabView>
    </>
  )

}

function EditPaper(props) {
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
                <label htmlFor="convenerInput" >Convener </label>
                <Field name="CONVENER" placeholder="Convener" className="form-control" id="convenerInput"/>
            </div>
            <div className="form-group col-md-4">
                <label htmlFor="sponsorPIInput" >Sponsoring PI </label>
                <Field name="SPONSORING_PI" placeholder="Sponsoring PI" className="form-control" id="sponsorPIInput"/>
            </div>
            <div className="form-group col-md-4">
                <label htmlFor="consortiumIDInput">Consortium </label>
                <Field name="CONSORTIUM_ID" placeholder="Consortium" className="form-control" id="consortiumIDInput"/>
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
                <label htmlFor="statisticiansInput" >Statistician </label>
                <Field name="STATISTICIAN" placeholder="Statistician" className="form-control" id="statisticiansInput"/>
            </div>
          </div>

          <div className="form-row">   
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
                <label htmlFor="ndiDataInput">
                NDI Data Used 
                <Field name="NDI_DATA_USED" id="ndiDataInput" type="checkbox" />
                </label>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="supFormsInput">Supplemental Forms Used</label>
                <Field name="SUPPLEMENTAL_FORMS_USED" className="form-control" id="supFormsInput" type="checkbox" />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="diiDataInput">DII Data Used</label>
                <Field name="DII_DATA_USED" className="form-control" id="diiDataInput" type="checkbox" />
              </div>
          </div>    

          <div className="form-row">   
            <div className="form-group col-md-4">
              <label htmlFor="relatedPapersInput">Related Papers</label>
              <Field name="RELATED_PAPERS" placeholder="Related Papers (Mark All)" className="form-control" id="relatedPapersInput" />
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
            <div className="form-group col-md-4">
              <label htmlFor="dataFocusInput">Data Focus </label>
              <Field as="select" name="DATA_FOCUS" placeholder="Data Focus" className="form-control" id="dataFocusInput">
                <option value="" label="Data Focus"></option>
                <option value="1" label="CT"></option>
                <option value="2" label="OS"></option>
                <option value="3" label="Both OS and CT"></option>
                <option value="4" label="WHIMS Memory Study"></option>
                <option value="5" label="N/A"></option>
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="paperFocusInput">Paper Focus </label>
              <Field as="select" name="PAPER_FOCUS" placeholder="Paper Focus" className="form-control" id="paperFocusInput">
                <option value="" label="Paper Focus"></option>
                <option value="1" label="Aging"></option>
                <option value="2" label="Behavioral and psychosocial"></option>
                <option value="3" label="Bone/Fracture/Osteoporosis"></option>
                <option value="4" label="Cancer"></option>
                <option value="5" label="Cardiovascular Disease"></option>
                <option value="6" label="Cognition"></option>
                <option value="7" label="Diabetes"></option>
                <option value="8" label="Diet and nutrition"></option>
                <option value="9" label="Electrocardiogram (ECG, EKG)"></option>
                <option value="10" label="Ethnicity"></option>
                <option value="11" label="Genetics, Proteomics and Biomarkers"></option>
                <option value="12" label="Hormone Therapy"></option>
                <option value="13" label="Obesity/Weight"></option>
                <option value="14" label="Other/None of the above"></option>
                <option value="15" label="Physical and Built Environment"></option>
                <option value="16" label="Physical Activity"></option>
                <option value="17" label="Study methods"></option>
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="sigsInput">Category </label>
              <Field as="select" name="SIGS" placeholder="SIGs" className="form-control" id="sigsInput">
                <option value="" label="SIGs"></option>
                <option value="1" label="Aging: Cognition & Functional Status"></option>
                <option value="2" label="Bone/Fracture & Body Composition"></option>
                <option value="3" label="Cancer"></option>
                <option value="4" label="CVD"></option>
                <option value="5" label="Genetics, Proteomics & Biomarkers"></option>
                <option value="6" label="Health Services & Comparative Effectiveness"></option>
                <option value="7" label="Minority and Health Disparities"></option>
                <option value="8" label="Nutrition/Energy Balance"></option>
                <option value="9" label="Obesity & Diabetes"></option>
                <option value="10" label="Physical & Built Environments"></option>
                <option value="11" label="Physical Activity/Body Composition"></option>
                <option value="12" label="Psychosocial & Behavioral Health"></option>
              </Field>
            </div>
          </div>

          <div className="form-row">   
            <div className="form-group col-md-12">
              <label htmlFor="keywordsInput">Keywords</label>
              <Field name="KEYWORDS" placeholder="Keywords" className="form-control" id="keywordsInput" />
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
  
  function EditAuthors(props) {
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
                <label htmlFor="newAuthorInput">Lead Author New to WHI</label>
                <Field name="NEWAUTHOR" className="form-control" id="authorsInput" type="checkbox" />
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="earlyCareerInput">Early-career investigator</label>
                <Field name="EARLYCAREERAUTHOR" className="form-control" id="earlyCareerInput" type="checkbox" />
              </div>
            </div>
            <br />
            <Button type="submit" label="Submit" />
          </Form>
        )}
        </Formik>
      )
    }

    function EditReviewers(props) {
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

      function EditRef(props) {
    return (
      <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
        {() => (
          <Form>
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
          </Form>
        )}
        </Formik>
      )
    }
      
  export default DetailPage