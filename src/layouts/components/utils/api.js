import axios from 'axios';

const base_url = "http://localhost:8000";

export function setToken(access_token, refresh_token) {
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
}

export function getAToken() {
  const token = localStorage.getItem('access_token')
  return token
}

export function getRToken() {
  const token = localStorage.getItem('refresh_token')
  return token
}

export function setRefresh(flag) {
  localStorage.setItem('active', flag)
}

export function getSelCollection() {
  const data = localStorage.getItem('collection')
  return JSON.parse(data)
}

export function setSelCollection(data) {
  localStorage.setItem('collection', data)
}

export function getSelDoc() {
  const data = localStorage.getItem('document')
  return JSON.parse(data)
}

export function setcollections(data) {
  localStorage.setItem('collections', data)
}

export function getcollectionsf() {
  const data = localStorage.getItem('collections')
  return JSON.parse(data)
}

export function setSelDoc(data) {
  localStorage.setItem('document', data)
}


export function emptyToken() {

  localStorage.clear()

}

export async function setHeader() {
  
  axios.defaults.headers['Authorization'] = `Bearer ${ getAToken() }`;
}

export async function login(data) {

  try {
    const response = await axios.post(base_url + '/auth/login', data);
    return response;

  } catch (error) {

    console.log(error.response)
    console.log('Login error:', error.response ? error.response.data : error.message);
    return error.response;
  }
}

export async function register(data) {

  try {

    const response = await axios.post(base_url + '/auth/register', data);
    return response; 

  } catch (error) {

    console.log('Register error:', error.response ? error.response.data : error.message);
    return error.response;

  }
}

export async function getAnswer(query, filter) {

  try {

    const response = await axios.post(base_url + '/chat/query', { query, collection_ids: filter });
    return response;

  } catch (error) {

    console.log('Get Answer error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return getAnswer( query, filter )
      }
    return error.response;
  }
}

export async function getCollections() {

  try {

    if(!axios.defaults.headers['Authorization'])
    {
      setHeader()
    }

    const response = await axios.get(base_url + '/collections/getall');
    return response;

  } catch (error) {

    console.log('Get Answer error:', error.response ? error.response.data : error.message);

    if(error.response && error.response.status === 401)
    {
      
      await refresh();
      return getCollections();
    }
    return error.response;
  }
}

export async function getonedoc(id, collection_id) {

  try {

    const response = await axios.get(base_url + '/collections/' + collection_id + '/documents/get' + id);
    return response;

  } catch (error) {
    console.log('Get Answer error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return getonedoc( id,collection_id )
      }
    return error.response;
  }
}

export async function getDocuments(id) {
  
  if(!id) { 
    return
  }

  try {

    const response = await axios.get(base_url + '/collections/' + id + '/documents/get');
    return response;

  } catch (error) {
    console.log('Get Answer error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return getDocuments( id )
      }
    return error.response;
  }
}

export async function createCollection() {
  
  try {

    const response = await axios.post(base_url + '/collections/create', { name: "", description: "" });
    return response;

  } catch (error) {
    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return createCollection()
      }
    return error.response;
  }
}

export async function createDocument( id ) {
  
  try {

    const response = await axios.post(base_url + '/collections/' + id + '/documents/create', { title: "UNTITLED", content: "UNTITLED" });
    return response;

  } catch (error) {
    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if( error.response && error.response.status === 401 )
      {
        await refresh()
        return createDocument( id )
      }
    return error.response;
  }
}

export async function updateDocument({ id, collection_id ,title , content }) {
  
  try {

    const response = await axios.post(base_url + '/collections/' + collection_id + '/documents/update', {document_id: id , title , content });
    return response;

  } catch (error) {
    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return updateDocument({ id, title, content })
      }
    return error.response;
  }
}

export async function updateCollection({ collectionID, title , comment }) {

  try {

    const response = await axios.post(base_url + '/collections/update', { collection_id:collectionID , name : title, description : comment });
    return response;

  } catch (error) {

    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return updateCollection({ collectionID, title, comment })
      }
    return error.response;
  }
}

export async function deleteCollection( id ) {
  
  if(!id)
  {
      return
  }
  
  try {

    const response = await axios.post(base_url + '/collections/' + id );
    return response;

  } catch (error) {

    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return deleteCollection( id )
      }

    return error.response;
  }
}

export async function deleteDocument( collection_id, doc_id ) {
  
  if(!collection_id || !doc_id)
  {
      return
  }
  
  try {

    const response = await axios.post(base_url + '/collections/' + collection_id + '/documents/' + doc_id + '/delete');
    return response;

  } catch (error) {

    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
        await refresh()
        return deleteCollection( collection_id, doc_id )
      }

    return error.response;
  }
}


export async function getHistory() {

  try {

    const response = await axios.get(base_url + '/chat/history');
    return response;

  } catch (error) {

    console.log('Create collection error:', error.response ? error.response.data : error.message);
    if(error.response && error.response.status === 401)
      {
         await refresh()
         return getHistory()
      }

     return error.response;
  }
}


async function refresh() {

  axios.defaults.headers['Authorization'] = `Bearer ${ getRToken() }`;
  const response = await axios.post(base_url + '/auth/refresh');
  if(response && response.status === 200)
    {
      setToken(response.data.access_token, response.data.refresh_token)
      setHeader()
    }
}