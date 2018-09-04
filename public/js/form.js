//form.js

class Form {
  constructor(parent) {
    this.parent=parent;

    this.cardHTML='';
    this.gridHeaderHTML='';
    this.gridRowHTML='';
    this.gridFooterHTML='';
    this.gridLength=10;

    this.cardGridVal=true; //select between card & grid screens
    this.screenModeVal=null; //defines available commands & controls
    this.allowEditVal=false;

    this.elmCommands=null;
    this.elmCard=null;
    this.elmGrid=null;
    this.elmControls=null;
    this.elmRecord=null;

    this.viewLength=0;
    this.iView=0;
    this.cache=[];
    this.cacheLength=20;
    this.offset=0;

    this.order={
      HTML:'<option value="id">ID</option>',
      field:'id',
      asc_desc:'ASC'
    }
    this.join=[]; //{table:, relation:, fields: [{name:, alias: }]}
    this.find=[]; //{name:, value:, range:} εδώ αποθηκεύονται οι επιλογές και αποστέλονται όσα πεδία έχουν στις class τη '_request'
    this.url={new:'', modify:'', delete:'', find:'', count:''};
  }

  init() {
    this.parent.innerHTML=(`
    <div class="form">
      <div class="commands">
        <input type="button" class="toggle" value="Καρτέλα/Λίστα"><!--
     --><input type="button" class="clear" value="Καθαρισμός"><!--
     --><input type="button" class="find" value="Αναζήτηση"><!--
     --><input type="button" class="new" value="Νέα Εγγραφή"><!--
     --><input type="button" class="modify" value="Τροποποίηση"><!--
     --><input type="button" class="delete" value="Διαγραφή"><!--
     --><input type="button" class="ok" value="OK"><!--
     --><input type="button" class="cancel" value="Άκυρο">
      </div>
      <div class="title">
      </div>
      <div class="card">
        ${this.cardHTML}
      </div>
      <div class="grid">
        ${this.gridHeaderHTML}
        ${Array(this.gridLength).fill(this.gridRowHTML).map(x=> x).join('')} 
        ${this.gridFooterHTML} 
      </div>
      <div class="controls">
        <input type="button" class="home" value="|<"><!--
     --><input type="button" class="prev" value="<"><!--
     --><input type="button" class="info" value="0/0"><!--
     --><input type="button" class="next" value=">"><!--
     --><input type="button" class="end" value=">|">
        <div class="order">
          <span>Ταξινόμηση</span><span class='right_arrow'></span>
          <select class="fields">
            ${this.order.HTML}
          </select> 
          <select class="asc_desc">
            <option value="ASC">ΑΥΞΑΝΟΝΤΑΣ</option>
            <option value="DESC">ΜΕΙΩΝΟΝΤΑΣ</option>
          </select> 
        </div>
      </div>
    </div>
    `);

    this.elmCommands=this.parent.querySelector('.form .commands');
    this.elmCard=this.parent.querySelector('.form .card');
    this.elmGrid=this.parent.querySelector('.form .grid');
    this.elmControls=this.parent.querySelector('.form .controls');

    this.elmCommands.querySelector('.toggle').onclick=()=>this.clickToggle();
    this.elmCommands.querySelector('.clear').onclick=()=>this.clickClear();

    this.elmCommands.querySelector('.new').onclick=()=>this.clickNew();
    this.elmCommands.querySelector('.find').onclick=()=>this.clickFind();
    this.elmCommands.querySelector('.modify').onclick=()=>this.clickModify();
    this.elmCommands.querySelector('.delete').onclick=()=>this.clickDelete();

    this.elmCommands.querySelector('.ok').onclick=()=>this.clickOk();
    this.elmCommands.querySelector('.cancel').onclick=()=>this.clickCancel();

    this.elmCard.querySelector('.record').ondblclick=()=>this.dblclickRecord();
    this.elmGrid.querySelectorAll('.record').forEach(x=> x.addEventListener("dblclick", e=>this.dblclickRecord(), true));
    this.elmGrid.querySelectorAll('.record').forEach(x=> x.addEventListener("click", e=>this.clickRecord(e), true));

    this.elmControls.querySelector('.home').onclick=()=>this.clickHome();
    this.elmControls.querySelector('.prev').onclick=()=>this.clickPrev();
    this.elmControls.querySelector('.next').onclick=()=>this.clickNext();
    this.elmControls.querySelector('.end').onclick=()=>this.clickEnd();
    this.elmControls.onkeydown=(e)=> 
      e.which===37 || e.which==33?this.clickPrev():
      e.which===39 || e.which==34?this.clickNext():
      e.which===103?this.clickHome():
      e.which===97?this.clickEnd():null;

    this.elmControls.querySelector('.order SELECT.fields').value=this.order.field;
    this.elmControls.querySelector('.order SELECT.asc_desc').value=this.order.asc_desc;

    this.cardGrid=true;
//    this.refresh(); εκτελείται τελευταίο από τις extended classes ώστε να είναι ενημερωμένα όλα τα elements
  }

//σχετικά με την εμφάνιση της φόρμας///////////////////////////////////////////

  clearElem(elm) {
    elm.tagName==='INPUT' && elm.type==='text'?elm.value='':
    elm.tagName==='INPUT' && elm.type==='password'?elm.value='':
    elm.tagName==='SELECT'?elm.value='':
    elm.tagName==='DIV'?elm.innerHTML='':
    elm.tagName==='P'?elm.innerHTML='':
    elm.tagName==='INPUT' && elm.type==='file'?elm.value='':
    elm.tagName==='CANVAS'?elm.parentObject.clear():null;
  }

  clearCard() {
    this.elmCard.querySelector('.record').querySelectorAll('._').forEach(x=> this.clearElem(x));
  }

  clearGrid() {
    this.elmGrid.querySelectorAll('.record').forEach(record=> record.querySelectorAll('._').forEach(x=> this.clearElem(x)));
  }

  fillElem(elm, value) {
    elm.parentObject && elm.parentObject.constructor.name==='DateInput'?elm.parentObject.raw=value:
    elm.parentObject && elm.parentObject.constructor.name==='FloatInput'?(value?elm.value=parseFloat(value).toFixed(elm.parentObject.decimals):value):
    elm.tagName==='INPUT' && elm.type==='text'?elm.value=value:
    elm.tagName==='INPUT' && elm.type==='password'?elm.value=value:
    elm.tagName==='SELECT'?elm.value=value:
    elm.tagName==='DIV'?elm.innerHTML=value:
    elm.tagName==='P'?elm.innerHTML=value:
    elm.tagName==='INPUT' && elm.type==='file'?null:
    elm.tagName==='CANVAS'?null:null;
  }

  fillCard() {
console.log('fillCard offset:'+this.offset+'/ index:'+(this.iView+1));
    this.clearCard();
    this.elmCard.querySelector('.record').querySelectorAll('._').forEach(x=> 
      this.fillElem(x, this.iView-this.offset<this.cache.length && this.cache[this.iView-this.offset][x.className.split(' ')[0]]?
      this.cache[this.iView-this.offset][x.className.split(' ')[0]]:''));
  }

  fillGrid() {
console.log('fillGrid offset:'+this.offset+'/ index:'+(this.iView+1));
    this.clearGrid();
    let rowsOffset=form.iView%this.gridLength;
    this.elmGrid.querySelectorAll('.record').forEach((record,i)=> record.querySelectorAll('._').forEach(x=>
      this.fillElem(x, this.iView-this.offset-rowsOffset+i<this.cache.length && this.cache[this.iView-this.offset-rowsOffset+i][x.className.split(' ')[0]]?
      this.cache[this.iView-this.offset-rowsOffset+i][x.className.split(' ')[0]]:'')));
  }

  fillControlsInfo() {
    this.elmControls.querySelector('.info').value=this.cardGrid?
      this.viewLength===0?0:(this.iView+1)+'/'+this.viewLength+' εγγραφές':
      this.viewLength===0?0:this.gridCurrentPage()+'/'+Math.ceil(this.viewLength/this.gridLength)+' σελίδες';
  }

  gridCurrentPage() {
    return Math.floor((this.iView)/this.gridLength)+1;
  }

  gridCurrentRow() {
    return this.iView%this.gridLength+1;
  }

  setClassFocused() {
    if (this.elmGrid.querySelector('.record.focused'))
      this.elmGrid.querySelector('.record.focused').className=this.elmGrid.querySelector('.record.focused').className.split(' ').filter(x=> {return x!='focused'}).join(" ");
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> (i===this.gridCurrentRow()-1)?x.className+=' focused':null);
    if (!this.cardGrid)
      this.elmRecord=this.elmGrid.querySelector('.record.focused');
  }

  set cardGrid(passval) {
    this.cardGridVal=passval;
    this.elmCard.style.display=this.cardGrid?'initial':'none';
    this.elmGrid.style.display=this.cardGrid?'none':'initial';
    this.elmCommands.querySelector('.toggle').value=this.cardGrid?'Λίστα':'Καρτέλα';
    this.elmRecord=this.cardGrid?this.elmCard.querySelector('.record'):
      this.elmGrid.querySelector('.record.focused')?this.elmGrid.querySelector('.record.focused'):
      this.elmGrid.querySelector('.record');
  }

  get cardGrid() {
    return this.cardGridVal;
  }

  set screenMode(passval) {
    this.screenModeVal=passval;

    //ορίζονται τα ενεργά ή μη commands και controls
    let buttons=(this.screenMode==='clear')?['toggle', 'new', 'find']:
    (this.screenMode==='data')?['toggle', 'clear', 'find', 'new', 'modify', 'delete']:
    (this.screenMode==='new')?['ok', 'cancel']:
    (this.screenMode==='find')?['ok', 'cancel']:
    (this.screenMode==='modify')?['ok', 'cancel']:
    (this.screenMode==='delete')?['ok', 'cancel']:[];
    this.elmCommands.querySelectorAll('input[type="button"]').forEach(x=> x.style.display=(buttons.indexOf(
      x.className.split(' ').filter((x,i)=> {return i===0}).join(" "))>=0)?'initial':'none');

    this.elmControls.querySelectorAll('input[type="button"]').forEach(x=> x.style.display=(this.screenMode==='data'?'initial':'none'));
    this.elmControls.querySelector('.order').style.display=(this.screenMode==='find'?'initial':'none');

    //ορίζεται η τρέχουσα κατάσταση στα class ώστε να μπορούν να επιλεγούν ανάλογοι χρωματισμοί
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll('.record ._').forEach(x=> {removeClass(x, 'onfind'); removeClass(x, 'onnew'); removeClass(x, 'onmodify'); removeClass(x, 'ondelete')});
    if (['find', 'new', 'modify', 'delete'].includes(this.screenMode))
      (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record${this.cardGrid?'':'.focused'} ._`).forEach(x=> addClass(x, 'on'+this.screenMode));

    //ορίζονται τα ενεργά ή μη πεδία
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll('.record ._').forEach(x=> x.disabled=true);
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record${this.cardGrid?'':'.focused'} ._${this.screenMode}`).forEach(x=> x.disabled=false);
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record${this.cardGrid?'':'.focused'} ._${this.screenMode}._first`).forEach(x=> x.focus());

    //εμφανίζονται ή κρύβονται τα βοηθητικά/προσωρινά πεδία
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record ._tmp`).forEach(x=> x.style.visibility='hidden');
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record${this.cardGrid?'':'.focused'} ._${this.screenMode}._tmp`).forEach(x=> x.style.visibility='visible');
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record ._relation`).forEach(x=> x.parentObject.closeList());
    (this.cardGrid?this.elmCard:this.elmGrid).querySelectorAll(`.record${this.cardGrid?'':'.focused'} ._${this.screenMode}._relation`).forEach(x=> x.parentObject.closeList());
  }

  get screenMode() {
    return this.screenModeVal;
  }

  refresh() {
    this.setClassFocused();
    if (this.viewLength>0) {
      this.screenMode=(this.screenMode==='new')?'new':'data'; //ώστε να επιτρέπονται επαναλαμβανόμενες νέες εγγραφές
      (this.cardGrid)?this.fillCard():this.fillGrid();
      this.fillControlsInfo();
      this.elmControls.querySelector('.next').focus();
    } else {
      this.screenMode='clear';
      this.clearCard();
      this.clearGrid();
    }
  }

//σχετικά με τα clicks στα buttons///////////////////////////////////////////// 

  clickToggle() {
    this.cardGrid=!this.cardGrid;
    this.refresh();
  }

  clickClear() {
    this.iView=0;
    this.viewLength=0;
    this.offset=0;
    this.cache=[];
    this.refresh();
    this.screenMode='clear';
  }

  clickFind() {
    this.clickClear();
    this.find.forEach(x=> this.fillElem((this.cardGrid?this.elmCard:this.elmGrid).querySelector('.record').querySelector(`._.${x.name}`),x.value));
    this.screenMode='find';
  }

  clickNew() {
    this.clickClear();
    this.screenMode='new';
    this.repeatedNew();
  }

  repeatedNew() {
    this.cache.push({});
    this.viewLength=this.cache.length;
    this.iView=this.cache.length-1;
    this.refresh();
  }

  clickModify() {
    this.screenMode='modify';
  }

  clickDelete() {
    this.screenMode='delete';
  }

  clickOk() {
    this.screenMode==='new'?this.okNew():
    this.screenMode==='modify'?this.okModify():
    this.screenMode==='delete'?this.okDelete():
    this.screenMode==='find'?this.okFind():null;
  }

  okNew() {
    this.reqNew();
  }

  okModify() {
    this.reqModify();
  }

  okDelete() {
    this.reqDelete();
  }

  okFind() {
    this.viewLength=0;
    this.iView=0;
    this.offset=0;
    this.find.forEach(x=> x.value=this.readElem(this.elmRecord.querySelector('._.'+x.name)));
    this.reqFind();
  }

  clickCancel() {
    this.screenMode==='new'?this.cancelNew():
    this.screenMode==='find'?this.cancelFind():null;
    this.refresh();
  }

  cancelNew() {
    this.screenMode='find'; //ώστε να διακόπτονται οι επαναλαμβανόμενες νέες εγγραφές
    this.cache.pop();
    this.viewLength=this.cache.length;
    this.iView=this.cache.length-1;
  }

  cancelFind() {
    this.find.forEach(x=> x.value='');
  }

  clickRecord(e) {
    if (this.screenMode==='data') {
      let clickedRow;
      this.elmGrid.querySelectorAll('.record').forEach((x,i)=> clickedRow=(x===e.currentTarget)?i+1:clickedRow);
      this.iView=(this.gridCurrentPage()-1)*this.gridLength+clickedRow-1;
      this.iView=Math.min(this.iView, this.viewLength-1)
      this.setClassFocused();
      e.stopPropagation();
    }
  }

  dblclickRecord() {
    if (this.screenMode==='data')
      this.clickToggle();
  }

  clickHome() {
    this.iView=0;
    if (this.iView<this.offset) {
      this.offset=0;
      this.reqFind();
    } else
      this.refresh();
  }

  clickPrev() {
    this.iView=Math.max(this.iView-(this.cardGrid?1:this.gridLength),0);
    if (this.iView-this.gridCurrentRow()+1<this.offset) {
      this.offset=Math.max((this.gridCurrentPage()*this.gridLength)-this.cacheLength,0);
      this.reqFind();
    } else
      this.refresh();
  }

  clickNext() {
    this.iView=Math.min(this.iView+(this.cardGrid?1:this.gridLength),this.viewLength-1);
    if (this.iView+Math.min(this.gridLength-this.gridCurrentRow(),this.viewLength-1-this.iView)>this.offset+this.cache.length-1) {
      this.offset=(this.gridCurrentPage()-1)*this.gridLength;
      this.reqFind();
    } else
      this.refresh();
  }

  clickEnd() {
    this.iView=this.viewLength-1;
    if (this.iView>this.offset+this.cache.length-1) {
      this.offset=this.cacheLength===0?0:this.viewLength-this.cacheLength;
      this.reqFind();
    } else
      this.refresh();
  }

//σχετικά με τα requests προς τον serve//////////////////////////////////////// 

  readElem(elm) {
    let retval=null;
    elm.parentObject && elm.parentObject.constructor.name==='DateInput'?retval=elm.parentObject.rawFrom+(elm.parentObject.rawTill?elm.parentObject.seperateDates+elm.parentObject.rawTill:''):
    elm.parentObject && elm.parentObject.constructor.name==='FloatInput'?retval=elm.parentObject.from()+(elm.parentObject.till()?elm.parentObject.seperateFloats+elm.parentObject.till():''):
    elm.tagName==='INPUT' && elm.type==='text'?retval=elm.value:
    elm.tagName==='INPUT' && elm.type==='password'?retval=elm.value:
    elm.tagName==='SELECT'?retval=elm.value:
    elm.tagName==='DIV'?retval=elm.innerHTML:
    elm.tagName==='P'?retval=elm.innerHTML:
    elm.tagName==='INPUT' && elm.type==='file'?null:
    elm.tagName==='CANVAS'?retval=elm.parentObject.base64():null;
    return (retval==='')?null:retval;
  }

  req(url, data, callback) {
    this.elmCommands.querySelectorAll('*').forEach(x=> x.disabled=true);
    this.elmControls.querySelectorAll('*').forEach(x=> x.disabled=true);
    request(url, data)
    .then((result)=> callback?callback(result):null)
    .then(()=> this.refresh())
    .catch(error=> alert((error.error)?error.error:error))
    .finally(()=> { this.elmCommands.querySelectorAll('*').forEach(x=> x.disabled=false);
      this.elmControls.querySelectorAll('*').forEach(x=> x.disabled=false);
      this.elmControls.querySelector('.info').focus();
    });
  }

  reqNew() {
    let fields=[]; //τα πεδία που θα σταλούν με το request
    let fieldsAll=[]; //όλα τα πεδία ώστε να ενημερωθεί η cache
    this.elmRecord.querySelectorAll('._request').forEach(x=> fields.push(x.className.split(' ')[0]));
    this.elmRecord.querySelectorAll('._').forEach(x=> fieldsAll.push(x.className.split(' ')[0]));
    let data={rawData:fields.map(x=> ({name:x, value:this.readElem(this.elmRecord.querySelector(`._request.${x}`))}))};
    this.req(this.url.new, data, (data)=> {
      if (data.error) throw data;
      this.elmRecord.querySelector('input.id').value=data.id;
      this.cache[this.iView-this.offset]['id']=data.id;
      fieldsAll.forEach(x=> this.cache[this.iView-this.offset][x]=this.readElem(this.elmRecord.querySelector(`.${x}`)));
      this.repeatedNew();
    });
  }

  reqModify(callback) {
    let fields=[]; //τα πεδία που θα σταλούν με το request
    let fieldsAll=[]; //όλα τα πεδία ώστε να ενημερωθεί η cache
    this.elmRecord.querySelectorAll('._request').forEach(x=> fields.push(x.className.split(' ')[0]));
    this.elmRecord.querySelectorAll('._').forEach(x=> fieldsAll.push(x.className.split(' ')[0]));
    let data={id:this.elmRecord.querySelector('.id').value, rawData:fields.map(x=> ({name:x, value:this.readElem(this.elmRecord.querySelector(`._request.${x}`))}))};
    this.req(this.url.modify, data, (result)=> {
      if (result.error) throw result;
      fieldsAll.forEach(x=> this.cache[this.iView-this.offset][x]=this.readElem(this.elmRecord.querySelector(`.${x}`)));
      callback?callback():null;
    });
  }

  reqDelete() {
    let data={id:this.elmRecord.querySelector('.id').value};
    this.req(this.url.delete, data, (result)=> {
      if (result.error) throw result;
      this.cache.splice(this.iView-this.offset, 1);
      this.viewLength--;
      this.iView=Math.min(this.iView, this.viewLength-1);
    });
  }

  reqFind() {
    let data={join: this.join,
              find: this.find.filter(x=> {return x.value && x.value.replace(/%/g, '')!=='' && this.elmRecord.querySelector(`.${x.name}._request`)}),
              order: (this.parent.querySelector('.order SELECT.fields').value?this.parent.querySelector('.order SELECT.fields').value:'')+
                     (this.parent.querySelector('.order SELECT.fields').value && this.parent.querySelector('.order SELECT.asc_desc').value?' '+this.parent.querySelector('.order SELECT.asc_desc').value:''), 
              offset: this.offset,
              limit: this.cacheLength};
    this.req(this.url.find, data, (data)=> {
      if (data.error) throw data;
      this.cache=data;
      console.log('reqFind '+this.cache.length+' records');
      if (this.viewLength===0)
        if (data.length<this.cacheLength) {
          this.viewLength=data.length;
        } else {
          data={find: this.find.filter(x=> {return x.value && x.value.replace(/%/g, '')!=='' && this.elmRecord.querySelector(`.${x.name}._request`)}),
                order: (this.parent.querySelector('.order SELECT.fields').value?this.parent.querySelector('.order SELECT.fields').value:'')+
                       (this.parent.querySelector('.order SELECT.fields').value && this.parent.querySelector('.order SELECT.asc_desc').value?' '+this.parent.querySelector('.order SELECT.asc_desc').value:'')
                };
          return request(this.url.count, data)
          .then(result=> this.viewLength=parseInt(result.count))
        }
    });
  }
}