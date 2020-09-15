import React from "react"
import { useParams } from "@reach/router"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field, FieldArray, FormikProps } from "formik"
import { Button } from "primereact/button"
import { Link } from "@reach/router"
import { IconName, FiHome } from "react-icons/fi"
import MainMenu from "./MainMenu"
import { TabView, TabPanel } from "primereact/tabview"
import { TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import Select from "react-select"
import { MultiSelect } from "primereact/multiselect"
import { Chips } from "primereact/chips"

export function DetailPage() {
  const { id } = useParams()
  const [data, setData] = React.useState()
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op
  const [isInsert, setIsInsert] = React.useState(false)
  const [stages, setStages] = React.useState()
  const [analyticStages, setAnalyticStages] = React.useState()
  const [statisticians, setStatisticians] = React.useState()
  const [paperTypes, setPaperTypes] = React.useState()
  const [dataFocus, setDataFocus] = React.useState()
  const [paperFocus, setPaperFocus] = React.useState()
  const [sigs, setSigs] = React.useState()
  const [alphaAuthors, setAlphaAuthors] = React.useState()
  const [consortia, setConsortia] = React.useState()
  const [sponsoringPI, setSponsoringPI] = React.useState()
  const [studies, setStudies] = React.useState()
  const [relatedStudies, setRelatedStudies] = React.useState()

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
  ]

  const paperStudyURL = `${CRUDURL}/paper_studies`

  React.useEffect(() => {
    if (id) {
      fetchPapers()
      fetchData()
    }
  }, [id])

  React.useEffect(() => {
    if (refreshData) {
      fetchPapers()
      setRefreshData(false)
    }
  }, [refreshData])

  async function fetchPapers() {
    fetch(`${QUERYURL}/papers?id=${id}`)
      .then(resp => resp.json())
      .then(json => {
        if (json.length > 0) {
          setData(json[0])
          setIsInsert(false)
        } else {
          setData({ MS_ID: id, PMID: "", TITLE: "", STAGE_ID: "0", CONVENER: "" })
          setIsInsert(true)
        }
      })
  }

  async function fetchData() {
    //const papersPromise = fetch(`${QUERYURL}/papers?id=${id}`).then(resp => resp.json())
    const stagesPromise = fetch(`${QUERYURL}/paper_stages`).then(resp => resp.json())
    const analyticStagesPromise = fetch(`${QUERYURL}/paper_analytic_stages`).then(resp => resp.json())
    const statisticiansPromise = fetch(`${QUERYURL}/paper_statisticians`).then(resp => resp.json())
    const paperTypesPromise = fetch(`${QUERYURL}/paper_types`).then(resp => resp.json())
    const dataFocusPromise = fetch(`${QUERYURL}/paper_data_focus`).then(resp => resp.json())
    const paperFocusPromise = fetch(`${QUERYURL}/paper_focus`).then(resp => resp.json())
    const sigsPromise = fetch(`${QUERYURL}/paper_sigs`).then(resp => resp.json())
    const alphaAuthorsPromise = fetch(`${QUERYURL}/paper_alpha_authors`).then(resp => resp.json())
    const consortiaPromise = fetch(`${QUERYURL}/paper_consortia`).then(resp => resp.json())
    const sponsoringPIPromise = fetch(`${QUERYURL}/paper_sponsoring_pis`).then(resp => resp.json())
    const studiesPromise = fetch(`${QUERYURL}/paper_studies_access`).then(resp => resp.json())
    //const relatedStudiesPromise = fetch(`${QUERYURL}/paper_related_studies?ms_id=${id}`).then(resp => resp.json())

    let [stages, analyticStages, statisticians, paperTypes, dataFocus, paperFocus, sigs, alphaAuthors,
      consortia, sponsoringPI, studies] = await Promise.all([stagesPromise, analyticStagesPromise,
        statisticiansPromise, paperTypesPromise, dataFocusPromise, paperFocusPromise, sigsPromise, alphaAuthorsPromise,
        consortiaPromise, sponsoringPIPromise, studiesPromise])

    // if (papers.length > 0) {
    //   setData(papers[0])
    //   setIsInsert(false)
    // } else {
    //   setData({ MS_ID: id, PMID: "", TITLE: "", STAGE_ID: "0", CONVENER: "" })
    //   setIsInsert(true)
    // }

    if (stages) {
      setStages(stages)
    }

    if (analyticStages) {
      setAnalyticStages(analyticStages)
    }

    if (statisticians) {
      setStatisticians(statisticians)
    }

    if (paperTypes) {
      setPaperTypes(paperTypes)
    }

    if (dataFocus) {
      setDataFocus(dataFocus)
    }

    if (paperFocus) {
      setPaperFocus(paperFocus)
    }

    if (sigs) {
      setSigs(sigs)
    }

    if (alphaAuthors) {
      setAlphaAuthors(alphaAuthors)
    }

    if (consortia) {
      setConsortia(consortia)
    }

    if (sponsoringPI) {
      setSponsoringPI(sponsoringPI)
    }

    if (studies) {
      setStudies(studies)
    }

    // if (relatedStudies) {
    //   setRelatedStudies(relatedStudies)
    // }
  }


  async function doSubmit(values) {
    //do edit or insert when form is submitted
    try {
      let dbVals = values
      delete dbVals.RELATED_STUDIES
      if (isInsert) {
        //calc next id
        await doInsert(`${CRUDURL}/papers`, dbVals).then(resp => resp.json())
      } else {
        await doEdit(`${CRUDURL}/papers`, dbVals).then(resp => resp.json())
      }

      setRefreshData(true) //fire off a requery of the page after the insert/update
    } catch (error) {
      alert("Something went wrong")
    }
    setEditItem(null) //clear edit item so edit form dissapears
    alert("MS-" + values.MS_ID + " has been SAVED")
  }

  async function addStudyToPaper(study) {
    console.log(study)
  }

  async function deleteStudyPaper(study) {
    await doDelete(paperStudyURL, { MS_ID: id, STUDY_ABBR: study[0] }).then(() => setRefreshData(true))

  }

  //if (!data) return "Loading..."

  return (
    <>
      <MainMenu />
      <TabView>
        <TabPanel header="Paper Detail">
          <div className="container">
            {data && <EditPaper editItem={data} stages={stages} analyticStages={analyticStages} statisticians={statisticians}
              paperTypes={paperTypes} dataFocus={dataFocus} paperFocus={paperFocus} sigs={sigs} alphaAuthors={alphaAuthors} consortia={consortia}
              sponsoringPI={sponsoringPI} studies={studies} options={options}
              doSubmit={doSubmit} deleteStudyPaper={deleteStudyPaper} addStudyToPaper={addStudyToPaper} cancelEdit={() => setData(null)} />}
          </div>
        </TabPanel>
        <TabPanel header="Author List">
          <div className="container">{data && <EditAuthors editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />}</div>
        </TabPanel>
        <TabPanel header="Reviewer Tracking">
          <div className="container">{data && <EditReviewers editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />}</div>
        </TabPanel>
        <TabPanel header="Reference Detail">
          <div className="container">{data && <EditRef editItem={data} doSubmit={doSubmit} cancelEdit={() => setData(null)} />}</div>
        </TabPanel>
      </TabView>
    </>
  )
}

function EditPaper(props) {

  return (
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
      {({ setFieldValue, values }) => (
        <Form>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="msIDInput">Manuscript ID</label>
              <Field name="MS_ID" placeholder="Manuscript ID" className="form-control" id="msIDInput" />
            </div>
            <div className="form-group col-md-10">
              <label htmlFor="titleInput">Title </label>
              <Field name="TITLE" placeholder="Manuscript Title" className="form-control" id="titleInput" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="convenerInput">Convener </label>
              <Field name="CONVENER" placeholder="Convener" className="form-control" id="convenerInput" value={values.CONVENER || ""}></Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="sponsorPIInput">Sponsoring PI </label>
              <Field as="select" name="SPONSORING_PI" placeholder="Sponsoring PI" className="form-control" id="sponsorPIInput" value={values.SPONSORING_PI || ""}>
                {props.sponsoringPI &&
                  props.sponsoringPI.map(row => {
                    return <option key={row.SPONSOR_ID} value={row.SPONSOR_ID === null ? "" : row.SPONSOR_ID} label={row.SPONSOR} />
                  })}
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="consortiumIDInput">Consortium </label>
              <Field as="select" name="CONSORTIUM_ID" placeholder="Consortium" className="form-control" id="consortiumIDInput" value={values.CONSORTIUM_ID || ""}>
                {props.consortia &&
                  props.consortia.map(row => {
                    return <option key={row.CONSORTIUM_ID} value={row.CONSORTIUM_ID === null ? "" : row.CONSORTIUM_ID} label={row.CONSORTIUM_NAME + " (" + row.CONSORTIUM_PI + ")"} />
                  })}
              </Field>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="stageInput">P&P Stage</label>
              <Field as="select" name="STAGE_ID" placeholder="Stage ID" className="form-control" id="stageInput">
                {props.stages &&
                  props.stages.map(row => {
                    return <option key={row.STAGE_ID} value={row.STAGE_ID === null ? "" : row.STAGE_ID} label={row.NAME} />
                  })}
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="analyticStageInput">Analytic Stage </label>
              <Field as="select" name="ANALYTIC_STAGE" placeholder="Analytic Stage" className="form-control" id="analyticStageInput" value={values.ANALYTIC_STAGE || ""}>
                {props.analyticStages &&
                  props.analyticStages.map(row => {
                    return <option key={row.ANALYSIS_ID} value={row.ANALYSIS_ID === null ? "" : row.ANALYSIS_ID} label={row.ANALYSIS_STAGE} />
                  })}
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="statisticiansInput">Statistician </label>
              <Field as="select" name="STATISTICIAN" placeholder="Statistician" className="form-control" id="statisticiansInput" value={values.STATISTICIAN || ""}>
                {props.statisticians &&
                  props.statisticians.map(row => {
                    return <option key={row.STATISTICIAN_ID} value={row.STATISTICIAN_ID === null ? "" : row.STATISTICIAN_ID} label={row.STATISTICIAN_LNAME} />
                  })}
              </Field>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="paperTypeInput">Paper Type </label>
              <Field as="select" name="PAPER_TYPE" placeholder="Paper Type" className="form-control" id="paperTypeInput" value={values.PAPER_TYPE || ""}>
                {props.paperTypes &&
                  props.paperTypes.map(row => {
                    return <option key={row.PTYPE_ID} value={row.PTYPE_ID === null ? "" : row.PTYPE_ID} label={row.PAPER_TYPE} />
                  })}
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="categoryInput">Category </label>
              <Field as="select" name="CATEGORY" placeholder="Category" className="form-control" id="categoryInput" value={values.CATEGORY || ""}>
                <option value="" label="Category"></option>
                <option value="1" label="Peer-reviewed"></option>
                <option value="2" label="Editorials and other"></option>
                <option value="9" label="Undecided"></option>
              </Field>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <div className="form-check">
                <Field name="NDI_DATA_USED" className="form-control-sm form-check-input" id="ndiDataInput" type="checkbox" value={values.NDI_DATA_USED || ""} />
                <label className="form-check-label" htmlFor="ndiDataInput">
                  National Death Index<br></br> Data Used{" "}
                </label>
              </div>
            </div>
            <div className="form-group col-md-4">
              <div className="form-check">
                <Field name="SUPPLEMENTAL_FORMS_USED" className="form-control-sm form-check-input" id="supFormsInput" type="checkbox" value={values.SUPPLEMENTAL_FORMS_USED || ""} />
                <label className="form-check-label" htmlFor="supFormsInput">
                  Supplemental <br></br>Forms Used
                </label>
              </div>
            </div>
            <div className="form-group col-md-4">
              <div className="form-check">
                <Field name="DII_DATA_USED" className="form-control-sm form-check-input" id="diiDataInput" type="checkbox" value={values.DII_DATA_USED || ""} />
                <label className="form-check-label" htmlFor="diiDataInput">
                  Dietary Inflammatory Index<br></br> Data Used
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="relatedPapersInput">Related Papers: NEED TO MAKE MULTICHOICE</label>
              <Chips value={props.editItem.RELATED_STUDIES ? props.editItem.RELATED_STUDIES.map(row => row.STUDY_ABBR) : []}
                onAdd={e => props.addStudyToPaper(e.value)}
                onRemove={e => props.deleteStudyPaper(e.value)}
                separator="," />

              {/*               <Field as="select" name="RELATED_PAPERS" placeholder="Related Papers (Mark All)" className="form-control" id="relatedPapersInput" value={values.RELATED_PAPERS || ""}>
                {props.relatedStudies &&
                  props.relatedStudies.map(row => {
                    return <option key={row.MS_ID} value={row.STUDY_ABBR === null ? "" : row.MS_ID} label={row.STUDY_ABBR} />
                  })}
              </Field>
 */}
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="proposalApprovalInput">PP Proposal Approval</label>
              <Field name="PP_PROPOSAL_APPROVAL" placeholder="PP Proposal Approval" className="form-control" id="proposalApprovalInput" value={values.PP_PROPOSAL_APPROVAL || ""} />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="manApprovalInput">PP Paper Approval </label>
              <Field name="PP_MANUSCRIPT_APPROVAL" placeholder="PP Paper Approval" className="form-control" id="manApprovalInput" value={values.PP_MANUSCRIPT_APPROVAL || ""} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="dataFocusInput">Data Focus </label>
              <Field as="select" name="DATA_FOCUS" placeholder="Data Focus" className="form-control" id="dataFocusInput" value={values.DATA_FOCUS || ""}>
                {props.dataFocus &&
                  props.dataFocus.map(row => {
                    return <option key={row.FOCUS_ID} value={row.FOCUS_ID === null ? "" : row.FOCUS_ID} label={row.FOCUS_NAME} />
                  })}
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="paperFocusInput">Paper Focus </label>
              <Field as="select" name="PAPER_FOCUS" placeholder="Paper Focus" className="form-control" id="paperFocusInput" value={values.PAPER_FOCUS || ""}>
                {props.paperFocus &&
                  props.paperFocus.map(row => {
                    return <option key={row.P_FOCUS_ID} value={row.P_FOCUS_ID === null ? "" : row.P_FOCUS_ID} label={row.P_FOCUS_NAME} />
                  })}
              </Field>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="sigsInput">SIGs </label>
              <Field as="select" name="SIGS" placeholder="SIGs" className="form-control" id="sigsInput" value={values.SIGS || ""}>
                {props.sigs &&
                  props.sigs.map(row => {
                    return <option key={row.SIG_ID} value={row.SIG_ID === null ? "" : row.SIG_ID} label={row.SIG_NAME} />
                  })}
              </Field>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="keywordsInput">Keywords</label>
              <Field name="KEYWORDS" placeholder="Keywords" className="form-control" id="keywordsInput" value={values.KEYWORDS || ""} />
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

export default DetailPage
