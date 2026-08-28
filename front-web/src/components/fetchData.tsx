import type { DBNode, User } from "../pages/Dashboard/nodes/types"

// const URL = "http://localhost:8080/" + "api/v1/"
const URL = "/api/v1/"
const loginURL = URL + "auth/login"
const nodes = "nodes/"
const parent_nodes = "parent_node/"

async function fetchRefreshTokenMiddleware(url: string, options: RequestInit) {
  options.credentials = 'include';
  let response = await fetch(url, options)

  if (response.status === 401) {
    console.log("going")
    try {
      const refreshURL = URL + "auth/refresh";
      const refreshResponse = await fetch(refreshURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({ username: "admin" })
      })
      const data = await refreshResponse.json()
      console.log(data)
      if (!refreshResponse.ok) throw new Error(data.error)
      response = await fetch(url, options)
    } catch (err) {
      console.error("RELOCATE, bro!", err)
      window.location.href = "/auth/login"
    }
  }
  return response
}
export async function fetchLogin(user: User) {
  const url = loginURL
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: "admin", password: user.password })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "unknown error")
    return data
  } catch (err) {
    console.error("the error: ", err)
    throw err
  }
}

export async function fetchNodes(id: string) {
  const url = URL + nodes + id

  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })
    if (!response.ok) throw new Error("error connecting")
    const data = await response.json()
    return data.rows

  } catch (err) {
    console.error("the error is: ", err)
  }
}
export async function fetchParentsNodes() {
  const url = URL + parent_nodes
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })

    console.log(response)
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "unknown error")
    return data.rows
  } catch (err) {
    console.error("the error is: ", err)
    throw err
  }
}

export type ParentTreeNode = {
  Id: number
  Data: string
  Children?: ParentTreeNode[]
}

export async function fetchParentTree() {
  const url = URL + parent_nodes + "tree"
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "unknown error")
    return data.rows as ParentTreeNode[]
  } catch (err) {
    console.error("the error is: ", err)
    throw err
  }
}

export async function fetchGetNodeName(nodeId: string) {
  const url = URL + parent_nodes + "getName/" + nodeId
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || "unknown error")
    }
    return data.rows[0].Data
  } catch (err) {
    console.error("error is:", err)
    throw err
  }
}
export async function fetchUpdateNodes(nodeId: number, updatedData: Partial<DBNode>) {
  const url = URL + nodes + nodeId
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
    })
    console.log(updatedData)
    if (!response.ok) throw new Error("error connecting")
    const data = await response.json()

    return data
  } catch (err) {
    console.error("the error is: ", err)
    throw err
  }
}
export type OrdenT = {
  ArrIds: { Id: string }[]
}
export async function fetchNormalizeOrden(idArr: OrdenT) {
  const url = URL + nodes + 'normalizeOrden';
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(idArr)
    })
    console.log('from fetch: ', idArr)
    if (!response.ok) throw new Error("error connecting")
    const data = await response.json()
    return data
  } catch (err) {
    console.error('error: ', err)
    throw err
  }
}

export async function fetchDeleteNode(nodeId: number) {
  const url = URL + nodes + nodeId
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) throw new Error("error with db")
    const data = await response.json()
    return data

  } catch (err) {
    console.error("error message from delete: ", err)
    throw err
  }
}
export async function fetchAddNode(parent_id: number, node: Pick<DBNode, "Type" | "Orden" | "Data" | "Ref_id">) {
  const url = URL + nodes + parent_id;

  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(node)
    })
    console.log(node)
    if (!response.ok) throw new Error("error")
    const data = await response.json()
    console.log(data)
    return data

  } catch (err) {
    console.error("error message: ", err)
    throw err
  }
}

export async function fetchAddParentNode(node: Pick<DBNode, "Data">) {
  const url = URL + parent_nodes
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(node)
    })
    if (!response.ok) throw new Error("error in connection")
    const data = await response.json()
    return data
  } catch (err) {
    console.error("error is: ", err)
    throw err
  }
}

export async function fetchNestedParents(parentId: string) {
  const url = URL + nodes + parentId + "/nested"
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })
    if (!response.ok) throw new Error("error connecting")
    const data = await response.json()
    return data.rows
  } catch (err) {
    console.error("error is: ", err)
    throw err
  }
}

export async function fetchLinkTargets() {
  const url = URL + nodes + "linkTargets"
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })
    if (!response.ok) throw new Error("error connecting")
    const data = await response.json()
    return data.rows
  } catch (err) {
    console.error("error is: ", err)
    throw err
  }
}

export async function fetchIncomingLinks(nodeId: number) {
  const url = URL + nodes + "incomingLinks/" + nodeId
  try {
    const response = await fetchRefreshTokenMiddleware(url, {
      method: 'GET',
    })
    if (!response.ok) throw new Error("error connecting")
    const data = await response.json()
    return data
  } catch (err) {
    console.error("error is: ", err)
    throw err
  }
}
