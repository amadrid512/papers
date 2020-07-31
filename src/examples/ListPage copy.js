import React from "react"
import { CRUDURL, doInsert, doEdit, doDelete, QUERYURL, fetchJson } from "../lib/restHelpers"
import { Formik, Form, Field } from "formik"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const crudUrl = `${CRUDURL}/papers`

export function ListPage() {
  const [data, setData] = React.useState()
  const [editItem, setEditItem] = React.useState() //holds the row to be edited or inserted
  const [refreshData, setRefreshData] = React.useState(true) // used to fire a re-query of the data after a crud op

  React.useEffect(() => {
    //query the category data (fires when refreshData is changed)
    if (refreshData) {
      fetch(crudUrl)
        .then(resp => resp.json())
        .then(json => setData(json.sort((a, b) => a.MS_ID > b.MS_ID)))
      setRefreshData(false)
    }
  }, [refreshData])

  function createNewItem() {
    //set edit item with a dummy row, -1 for pk col will be replaced later...
    setEditItem({ MS_ID: -1, PMID: "", TITLE: "" })
  }

  async function deleteItem(item) {
    //do delete after confirming its ok
    if (window.confirm("are you sure you want to delete MS" + item.MS_ID + "?")) {
      await doDelete(crudUrl, item)
      setRefreshData(true)
    }
  }

  async function doSubmit(values) {
    //do edit or insert when form is submitted
    const isInsert = values.MS_ID === -1 //-1 is flag that this is a new row to be inserted
    try {
      if (isInsert) {
        //calc next id
        const max_id = data.reduce((max, row) => (row.MS_ID * 1 > max ? row.MS_ID * 1 : max), 0)
        values.MS_ID = max_id + 1 //next id

        await doInsert(crudUrl, values).then(resp => resp.json())
      } else {
        await doEdit(crudUrl, values).then(resp => resp.json())
      }

      setRefreshData(true) //fire off a requery of the page after the insert/update
    } catch (error) {
      alert("Something went wrong")
    }
    setEditItem(null) //clear edit item so edit form dissapears
  }

function actions(rowdata){
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

  if (!data) return "Loading..." //while fetch is getting data, display this message

  return (
    <div className="container">
      <h1>Manuscripts Main Tracking</h1>
      {editItem && (
        <Dialog header="Paper Detail" visible={true} style={{ width: "95vw" }} modal={true} onHide={() => this.setState({ visible: false })}>
          <EditForm editItem={editItem} doSubmit={doSubmit} cancelEdit={() => setEditItem(null)} />
        </Dialog>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn" onClick={createNewItem}>
          Add New <FaPlus title="Add New Row" />
        </button>
      </div>

      <DataTable value={data} paginator={true} rows={100} >
        <Column field="MS_ID" header="Manuscript ID" sortable={true} filter={true} filterPlaceholder="Search" style={{width:'10%'}}/>
        <Column field="TITLE" header="Title" sortable={true} filter={true} filterPlaceholder="Search" style={{width:'60%'}}/>
        {/* <Column field="TITLE" header="Manuscript Title" sortable={true} body={row => row.PUB_PUBLISH_DATE.toLocaleDateString()} /> */}
        <Column header="Keywords" filter={true} filterPlaceholder="Search" style={{width:'20%'}} />
        <Column header="Actions" sortable={false} body={actions} style={{width:'10%'}} />
      </DataTable>
    </div>
  )
}

function EditForm(props) {
  return (
    <Formik initialValues={{ ...props.editItem }} onSubmit={props.doSubmit}>
      {() => (
        <Form>
          <div class="form-row">   
            <div className="form-group col-md-2">
              <label for="msIDInput">Manuscript ID</label>
              <Field name="MS_ID" placeholder="Manuscript ID" className="form-control" id="msIDInput" />
            </div>
            <div className="form-group col-md-10">
              <label for="titleInput">Title </label>
              <Field name="TITLE" placeholder="Manuscript Title" className="form-control" id="titleInput"/>
            </div>
          </div>

          <div class="form-row">             
            <div className="form-group col-md-4">
              <label for="stageInput" >Stage</label>
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
              <label for="analyticStageInput" >Analytic Stage </label>
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
              <label for="convenerInput" >Convener </label>
              <Field name="CONVENER" placeholder="Convener" className="form-control" id="convenerInput"/>
            </div>
          </div>

          <div class="form-row">   
            <div className="form-group col-md-4">
              <label for="authorsInput">List of Authors</label>
              <Field name="AUTHORS" placeholder="List of Authors [Array]" className="form-control" id="authorsInput" />
            </div>
            <div className="form-group col-md-4">
              <label for="paperTypeInput">Paper Type </label>
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
              <label for="categoryInput">Category </label>
              <Field as="select" name="CATEGORY" placeholder="Category" className="form-control" id="categoryInput">
                <option value="" label="Category"></option>
                <option value="1" label="Peer-reviewed"></option>
                <option value="2" label="Editorials and other"></option>
                <option value="9" label="Undecided"></option>
              </Field>
            </div>
          </div>

          <div class="form-row">   
            <div className="form-group col-md-4">
              <label for="relatedPapersInput">Related Papers</label>
              <Field name="RELATED_PAPERS" placeholder="Related Papers (Mark All)" className="form-control" id="relatedPapersInput" />
            </div>
            <div className="form-group col-md-2">
              <label for="consortiumIDInput">Consortium </label>
              <Field name="CONSORTIUM_ID" placeholder="Consortium" className="form-control" id="consortiumIDInput"/>
            </div>
            <div className="form-group col-md-3">
              <label for="proposalApprovalInput">PP Proposal Approval</label>
              <Field name="PP_PROPOSAL_APPROVAL" placeholder="PP Proposal Approval" className="form-control" id="proposalApprovalInput"/>
            </div>
            <div className="form-group col-md-3">
              <label for="manApprovalInput">PP Paper Approval </label>
              <Field name="PP_MANUSCRIPT_APPROVAL" placeholder="PP Paper Approval" className="form-control" id="manApprovalInput"/>
            </div>
          </div>

          <div class="form-row">   
            <div className="form-group col-md-8">
              <label for="referenceInput">Reference</label>
              <Field name="REFERENCE" placeholder="Reference" className="form-control" id="referenceInput" />
            </div>
            <div className="form-group col-md-2">
              <label for="pubMonthInput">Pub Month </label>
              <Field name="PUB_MONTH" placeholder="Pub Month " className="form-control" id="pubMonthInput"/>
            </div>
            <div className="form-group col-md-2">
              <label for="pubYearInput">Pub Year </label>
              <Field name="PUB_YEAR" placeholder="Pub Year " className="form-control" id="pubYearInput"/>
            </div>
          </div>

          <div class="form-row">   
            <div className="form-group col-md-8">
              <label for="citationInput">Full Citation</label>
              <Field name="FULL_CITATION" placeholder="Full Citation" className="form-control" id="citationInput" />
            </div>
            <div className="form-group col-md-2">
              <label for="pubmedIDInput">PubMed ID </label>
              <Field name="PMID" placeholder="PubMed ID" className="form-control" id="pubmedIDInput"/>
            </div>
            <div className="form-group col-md-2">
              <label for="pubmedCentralInput">PubMed Central </label>
              <Field name="PUBMED_CENTRAL" placeholder="PubMed Central" className="form-control" id="pubmedCentralInput"/>
            </div>
          </div>

          <div class="form-row">   
            <div className="form-group col-md-12">
              <label for="abstractInput">Abstract</label>
              <Field name="ABSTRACT" placeholder="Abstract" className="form-control" id="abstractInput" />
            </div>
          </div>
          <br />
          <Button type="submit" label="Submit" />
          <Button type="button" label="Cancel" onClick={() => props.cancelEdit()} />
        </Form>
      )}
    </Formik>
  )
}
