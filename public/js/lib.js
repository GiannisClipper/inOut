//main.js

function initHeaderMenu(passval) {
//  document.querySelectorAll('HEADER NAV A').forEach(x=> x.innerHTML===passval?addClass(x, 'selected'):null);
 // document.querySelectorAll('HEADER NAV A').forEach(x=> console.log(x.innerHTML+'='+passval+'=>'+(x.innerHTML==passval?'true':'false')));
}

function addClass(elm, name) {
  if (!elm.className.split(' ').includes(name))
    elm.className+=((elm.className?' ':'')+name);
}

function removeClass(elm, name) {
  elm.className=elm.className.split(' ').filter(x=> x!==name).join(' ');
}
