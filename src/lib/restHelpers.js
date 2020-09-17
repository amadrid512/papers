export const JSON_API_ROOT = process.env.REACT_APP_JSON_API_ROOT || "https://devccc.whi.org/api"
export const QUERYURL = `${JSON_API_ROOT}/query`
export const CRUDURL = `${JSON_API_ROOT}/crud`
export const PROCURL = `${JSON_API_ROOT}/proc`

const headers = { "content-type": "application/json" }
/* fetchJson - helper function for doing GET fetches
   takes a url and an optional object with param values
   returns a promise (after converting body to json) 

   - Builds a url param string from param object
   - converts body to json
   - throws errors if !resp.ok
   - converts date values to Javascript dates

   usage (with .then)
     fetchJson(url, {param1: 5, param2: 3})
       .then(json => setData(json))
       .catch(resp => console.log(resp.statusText))

   or in an async function...
      try {
        const data = await fetchJson(url, {param1: 5, param2: 3})
      } catch(resp) {
        console.log(resp.statusText)
      }

*/

export async function fetchJson(url, params) {
  const paramStr = params ? paramObjToParamStr(params) : ""
  const resp = await fetch(url + paramStr, { method: "GET", headers })
  if (resp.status === 401 || resp.status === 403 || !resp.ok) throw resp
  const data = await resp.json()
  const data2 = convertStringDatesToJavascriptDates(data)
  return data2
}

// all crud operations do the same thing, the only difference is the http method
async function doCrudFetch(method, url, body) {
  console.log(JSON.stringify(body))
  const resp = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body)
  })

  if (resp.status === 401 || resp.status === 403 || !resp.ok) throw resp
  return resp
}

/* doEdit - helper function for doing updates
   parameters 
     url: the url to send the put to (usually one of our CRUDURL ones) 
     body : an object with values matching the row to be updated.  
   
   usage 
     doEdit(url, {ID: 1, NAME: 'My thing'})
       .then(resp => ...)
    or
    const result = await doEdit(url, , {ID: 1, NAME: 'My thing'})

    if using a Json_crud_tables url...
    - object must include pk columns
    - only values that are different than the current value will be updated.
    - pk columns cant be updated
    - any columns not in table will be ignored.
*/
export const doEdit = (url, body) => doCrudFetch("put", url, body)

/* doInsert - helper function for doing inserts (usually using our Json_CRUD table)

   parameters 
     url: the url to send the post to (usually one of our CRUDURL ones) 
     body : an object with values matching the row to be inserted.  
   
   usage, see doEdit
*/
export const doInsert = (url, body) => doCrudFetch("post", url, body)

/* doDelete - helper function for doing deletes (usually using our Json_CRUD table)

   parameters 
     url: the url to send the delete to (usually one of our CRUDURL ones) 
     body : an object with at least the pk column values matching the row to be deleted  

  usage: see doEdit

  if using a Json_crud_tables url...
    - object must include pk columns
    - any columns not in pk
*/
export const doDelete = (url, body) => doCrudFetch("delete", url, body)

/* execProcedure - helper function for executing pl/sql procedures (usually using our Json_plsql table)

   parameters 
     url: the url to send the post to (usually one of our Json_plsql ones) 
     body : an object with at least the pk column values matching the row to be deleted  

    usage:
    execProcedure(PROCURL + '/formSubmit', { fevt_id_in: 1234 })
      .then(resp => loadFevtData(guid))
      .catch(err => alert(err))

  if using a Json_plsql url...
    - object names must match pl/sql parameter names
    - All parameters must be sent values
*/
export const execProcedure = (url, body) => doCrudFetch("post", url, body)

export function paramObjToParamStr(paramObj) {
  const paramStr = Object.entries(paramObj).reduce((pstr, entry) => pstr + `&${entry[0]}=${entry[1]}`, "")
  return "?" + paramStr.substr(1)
}

function convertIfDate(value) {
  //24-SEP-20 12.00.00.000000 AM
  console.log("in convertIfDate")
  const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
  const oracleDateExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === "string" && iso8601RegExp.test(value)) {
    return new Date(value)
  } else if (typeof value === "string" && oracleDateExp.test(value)) {
    return new Date(value)
  } else {
    return value
  }
}

export function convertStringDatesToJavascriptDates(data) {
  const data2 = data.map(row => {
    let newRow = {}
    Object.entries(row).forEach(entry => {
      const name = entry[0]
      const value = entry[1]
      if (Array.isArray(value)) newRow[name] = convertStringDatesToJavascriptDates(value)
      else newRow[name] = convertIfDate(value)
    })
    return newRow
  })
  return data2
}