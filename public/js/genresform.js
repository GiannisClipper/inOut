//genresform.js

class GenresForm extends Form {
  constructor(parent) {
    super(parent);
    this.fundCard=new FundRelation();
    this.icon=new IconCanvas();
    this.cardHTML=`
      <div class="record">
        <div class="left">
          <div>Εικόνα</div>${this.icon.codeHTML}
        </div>
        <div class="right">
          <div>ID</div><div><input type="text" class="id _" readonly></div>
          <div>Κωδικός</div><div><input type="text" class="code _ _find _new _modify _request"></div>
          <div>Όνομα</div><div><input type="text" class="name _ _find _new _modify _request"></div>
          <div>Έσοδα/Έξοδα</div><div><select class="inout _ _new _modify _request"><option value="1">ΕΣΟΔΑ</option><option value="2">ΕΞΟΔΑ</option></select></div>
          <div>Λογαριασμός[]</div><div>${this.fundCard.codeHTML}</div>
        </div>
      </div>
    `;
    this.gridHeaderHTML=`
      <div class="titles">
        <span class="id">ID</span><span class="code">Κωδικός</span><span class="name">Όνομα</span><span class="inout">Έσδ/Έξδ</span><span class="fund_name">Λογαριασμός[]</span><span class="icon">Εικόνα</span>
      </div>
    `;
    this.fundGrid=Array(this.gridLength).fill().map(x=> x=new FundRelation());
    this.gridRowHTML=`
      <div class="record">
        <input type="text" class="id _"><!--
     --><input type="text" class="code _ _find _new _modify _request"><!--
     --><input type="text" class="name _ _find _new _modify _request"><!--
     --><select class="inout _ _new _modify _request"><option value="1">ΕΣΟΔΑ</option><option value="2">ΕΞΟΔΑ</option></select><!--
     -->${this.fundGrid[0].codeHTML}<!--
     --><input type="text" class="icon _">
      </div>
    `;

    this.orderHTML=`
      <option value="code">ΚΩΔΙΚΟΣ</option>
      <option value="name">ΟΝΟΜΑ</option>
      <option value="fund_id">ΛΟΓΑΡΙΑΣΜΟΣ</option>
    `;

    this.join=[
      {table:'funds', relation:'genres.fund_id=funds.id', fields:[{name:'name', alias:'fund_name'}]}
    ];

    this.find=[
      {name:'code', value:'%'},
      {name:'name', value:'%'},
      {name:'fund_id', value:''}
    ];

    this.url.new='/genres/new'; 
    this.url.modify='/genres/modify';
    this.url.delete='/genres/delete';
    this.url.find='/genres/find'; 
    this.url.count='/genres/count';
  }

  init() {
    super.init();
    this.fundCard.init(this.elmCard.querySelector('.record'));
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> this.fundGrid[i].init(x));
    this.icon.init(this.elmCard);
    this.refresh();
  }

  fillCard() {
    super.fillCard();
    let record=this.elmCard.querySelector('.record');
    if (this.cache[this.iView-this.offset].icon==='...')
      request('/genres/icon', {id: this.elmCard.querySelector('.id').value})
      .then(data=> this.icon.fill(data.icon))
      .catch(error=> alert((error.error)?error.error:error));
  }

  set screenMode(passval) {
    super.screenMode=passval;
    this.icon.canvas.onclick=['new','modify'].indexOf(this.screenMode)>=0?()=> this.icon.delete():null;
  }

  refresh() {
    super.refresh();
    if (this.screenMode==='new')
      this.elmRecord.querySelector('.inout').value='2';
  }

  get screenMode() {
    return super.screenMode;
  }

  okModify() {
    this.reqModify(()=> this.cardGrid?this.cache[this.iView-this.offset].icon=this.icon.isClear()?'':'...':null);
  }
}