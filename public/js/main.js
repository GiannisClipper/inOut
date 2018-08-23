//lib.js

function addClass(elm, name) {
  if (elm.className=elm.className.split(' ').filter(x=> x===name).length===0);
    elm.className+=((elm.className?' ':'')+name);
}

function removeClass(elm, name) {
  elm.className=elm.className.split(' ').filter(x=> x!==name).join(' ');
}
