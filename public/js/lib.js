//lib.js

function addClass(elm, name) {
  if (!elm.className.split(' ').includes(name))
    elm.className+=((elm.className?' ':'')+name);
}

function findClass(elm, name) {
  return elm.className.split(' ').includes(name);
}

function removeClass(elm, name) {
  elm.className=elm.className.split(' ').filter(x=> x!==name).join(' ');
}

function replaceClass(elm, name, newName) {
  removeClass(elm, name);
  addClass(elm, newName);
}

function openLoader() {
  var elem=document.createElement("div");
  elem.className="loader";
  document.body.appendChild(elem);
  return elem;
}

function closeLoader(elem) {
  elem.parentElement.removeChild(elem);
}

