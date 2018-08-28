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

function request(url='', data={}) {
  return new Promise((resolve, reject)=> {
      const errors=localVerify(url, data);
      (errors===null)?resolve():reject(errors);
    }) 
    .then(()=> fetch(url, initFetch(data)))
    .then(response=> response.json());
}

function requestText(url='', data={}) {
  return new Promise((resolve, reject)=> {
      const errors=localVerify(url, data);
      (errors===null)?resolve():reject(errors);
    }) 
    .then(()=> fetch(url, initFetch(data)))
    .then(response=> response.text());
}

function localVerify(url, data) {
  let fields=[];
  (url==='/genres/new')?fields.push('code', 'name'):  
  (url==='/genres/modify')?fields.push('id', 'code', 'name'):  
  (url==='/genres/delete')?fields.push('id'):null;  

  let errors=['Error(s) found'];
  for (let x of fields)
    if (data[x]==='') errors.push(x+' is empty');

  return (errors.length>1)?errors:null;
}