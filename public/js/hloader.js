//hloader.js

class HLoader {
  constructor() {
  }

  static open() {
    let elm=document.createElement("div");
    elm.className="loader";
    document.body.appendChild(elm);
    return elm;
  }

  static close(elm) {
    elm.parentElement.removeChild(elm);
  }
}
