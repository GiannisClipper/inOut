//client.js

function initFetch(data) {
  return {
    method: "POST", //*GET, POST, PUT, DELETE, etc. Default options are marked with *
    mode: "cors", //no-cors, cors, *same-origin
    cache: "no-cache", //*default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", //include, same-origin, *omit
    headers: {"Content-Type": "application/json; charset=utf-8"},  //"Content-Type": "application/x-www-form-urlencoded"
    redirect: "follow", //manual, *follow, error
    referrer: "no-referrer", //no-referrer, *client
    body: JSON.stringify(data), //body data type must match "Content-Type" header
  }
};

function request(url='', data={}, resType=null) {
  let loader=openLoader();
  return new Promise((resolve, reject)=> {
      const errors=clientValidate(url, data);
      (errors===null)?resolve():reject(errors);
    }) 
    .then(()=> fetch(url, initFetch(data)))
    .then(response=> (resType==='text')?response.text():response.json())
    .finally(()=> closeLoader(loader));
}

function clientValidate(url, data) {
  let fields=[];
  (url==='/users/new')?fields.push('name', 'password', 'level'):  
  (url==='/users/modify')?fields.push('name', 'password', 'level'):

  (url==='/funds/new')?fields.push('code', 'name'):  
  (url==='/funds/modify')?fields.push('code', 'name'):  

  (url==='/genres/new')?fields.push('code', 'name', 'inout'):  
  (url==='/genres/modify')?fields.push('code', 'name', 'inout'):   

  (url==='/trans/new')?fields.push('date', 'genre_id', 'fund_id'):  
  (url==='/trans/modify')?fields.push('date', 'genre_id', 'fund_id'):null;

  let labels={code:'Κωδικός', name:'Όνομα', password:'Κωδ. εισόδου', level:'Επίπεδο', date:'Ημ/νία', genre_id:'Κατηγορία', fund_id:'Λογαριασμός', inout:'Εσοδα/Εξοδα'};
  let errors=fields.filter(x=> data.rawData.filter(y=> y.name===x && y.value).length===0).map(x=> labels[x]?labels[x]:x);
  return (errors.length>0)?'Χρειάζεται να συμπληρωθούν τιμές: '+errors.join(', '):null;
}