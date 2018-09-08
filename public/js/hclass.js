//hclass.js

class HClass {
  constructor() {
  }

  static add(elm, name) {
    if (!elm.className.split(' ').includes(name))
      elm.className+=((elm.className?' ':'')+name);
  }

  static find(elm, name) {
    return elm.className.split(' ').includes(name);
  }

  static remove(elm, name) {
    elm.className=elm.className.split(' ').filter(x=> x!==name).join(' ');
  }

  static replace(elm, name, newName) {
    HClass.remove(elm, name);
    HClass.add(elm, newName);
  }

}
