//fundsform.js

class FundsForm extends Form {
  constructor(parent) {
    super(parent);
    this.icon=new IconCanvas();
    this.cardHTML=`
      <div class="record">
        <div class="left">
          <div>Εικόνα</div>${this.icon.codeHTML}
        </div>
        <div class="right">
          <div>ID</div><div><input type="text" class="id _" readonly></div>
          <div>Κωδικός</div><div><input type="text" class="code _ _find _new _modify _first _request"></div>
          <div>Όνομα</div><div><input type="text" class="name _ _find _new _modify _request"></div>
        </div>
      </div>
    `;
    this.gridHeaderHTML=`
      <div class="titles">
        <span class="id">ID</span><span class="code">Κωδικός</span><span class="name">Όνομα</span><span class="icon">Εικόνα</span>
      </div>
    `;
    this.gridRowHTML=`
      <div class="record">
        <input type="text" class="id _"><!--
     --><input type="text" class="code _ _find _new _modify _first _request"><!--
     --><input type="text" class="name _ _find _new _modify _request"><!--
     --><input type="text" class="icon _">
      </div>
    `;

    this.orderHTML+=`
      <option value="code">ΚΩΔΙΚΟΣ</option>
      <option value="name">ΟΝΟΜΑ</option>
    `;
    this.order.field='id';
    this.order.asc_desc='ASC';

    this.find=[
      {name:'code', value:'%'},
      {name:'name', value:'%'}
    ];

    this.url.new='/funds/new'; 
    this.url.modify='/funds/modify';
    this.url.delete='/funds/delete';
    this.url.find='/funds/find'; 
    this.url.count='/funds/count';
  }

  init() {
    super.init();
    this.icon.init(this.elmCard.querySelector('.record'));
    this.refresh();
  }

  fillCard() {
    super.fillCard();
    let record=this.elmCard.querySelector('.record');
    if (this.cache[this.iView-this.offset].icon==='...')
      request('/funds/icon', {id: this.elmCard.querySelector('input.id').value})
      .then(data=> this.icon.fill(data.icon))
      .catch(error=> alert((error.error)?error.error:error));
  }

  set screenMode(passval) {
    super.screenMode=passval;
    this.icon.canvas.onclick=['new','modify'].indexOf(this.screenMode)>=0?()=> this.icon.delete():null;
  }

  get screenMode() {
    return super.screenMode;
  }

  okModify() {
    this.reqModify(()=> this.cardGrid?this.cache[this.iView-this.offset].icon=this.icon.isClear()?'':'...':null);
  }
}