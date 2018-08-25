//canvas.js

class Canvas {
  constructor() {
    this.parent=null;
    this.canvas=null;
  }

  init(parent) {
    this.parent=parent;
    this.canvas=this.parent.querySelector('CANVAS');
    this.canvas.parentObject=this;
  }

  clear() {
    const ctx=this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  isClear() {
    let clear=document.createElement('canvas');
    clear.width=this.canvas.width;
    clear.height=this.canvas.height;
    let retval=(this.canvas.toDataURL()===clear.toDataURL());
    document.body.appendChild(clear);
    document.body.removeChild(clear);
    return retval;
  }

  fill(src=null) {
    const ctx=this.canvas.getContext('2d');
    const img=new Image();
    img.crossOrigin="anonymous";
    img.onload=()=> {ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
console.log('blob '+this.canvas.toDataURL("image/jpeg", 0.5).length+' bytes');
    }
    if (src!=null)
      if (typeof src==='string') img.src=src;
      else img.src=window.URL.createObjectURL(src);
  }

  base64() {
  if (!this.isClear())
    return this.canvas.toDataURL("image/jpeg", 0.5);
  else
    return null;
  }
}

class IconCanvas extends Canvas {
  constructor() {
    super();
    this.codeHTML=`<!--
   --><span class="canvas"><!--
     --><canvas class="icon _ _new _modify _request" width="150" height="150"></canvas><!--
     --><div class="tools"><!--
       --><input type="file" class="file _ _new _modify _tmp" accept=".jpg, .jpeg, .png, .gif, .bmp" hidden><!--
       --><input type="button" class="button _ _new _modify _tmp" value="εισαγωγή από αρχείο"><!--
       --><input type="text" class="url _ _new _modify _tmp" placeholder="ή από url"><!--
     --></div><!--
   --></span><!--
 -->`;
  }

  init(parent) {
    super.init(parent);
    this.parent.querySelector('.button').onclick=(e)=> this.parent.querySelector('.file').click();
    this.parent.querySelector('.file').onchange=(e)=> this.fill(e.target.files[0]);
    this.parent.querySelector('.url').onblur=(e)=> this.fill(e.target.value);
  }

  delete() {
    this.parent.querySelector('.file').value='';
    this.parent.querySelector('.url').value='';
    this.clear();
  }
}