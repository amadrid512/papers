import React from "react"
import { useParams } from "react-router-dom"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

import { QUERYURL, fetchJson } from "../lib/restHelpers"

export function DetailPage() {
  const { id } = useParams()
  const [data, setData] = React.useState()

  React.useEffect(() => {
    fetchJson(`${QUERYURL}/F2_PubQueries?pubId=${id}`).then(json => setData(json))
  }, [id])

  if (!data) return "Loading..."

  return (
    <div className="container">
      <h1>Publish Queries</h1>
      <DataTable value={data}>
        <Column field="QCAT_SHORT_NAME" header="Category" />
        <Column field="QRY_SHORT_NAME" header="Query" />
      </DataTable>
    </div>
  )
}
