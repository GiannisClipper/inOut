//userssform.js

class UsersForm extends Form {
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
          <div>Όνομα</div><div><input type="text" class="name _ _find _new _modify _first _request"></div>
          <div>Κωδικός εισόδου</div><div><input type="password" class="password _ _new _modify _request"></div>
          <div>Επανάληξη κωδικού</div><div><input type="password" class="password _ _new _modify"></div>
          <div>Επίπεδο</div><div><select class="level _ _new _modify _request"><option value="admin">ADMIN</option><option value="guest">GUEST</option></select></div>
        </div>
      </div>
    `;
    this.gridHeaderHTML=`
      <div class="titles">
        <span class="id">ID</span><span class="name">Όνομα</span><span class="password">Κωδικός εισόδου</span><span class="password">Επανάληψη κωδ</span><span class="level">Επίπεδο</span><span class="icon">Εικόνα</span>
      </div>
    `;
    this.gridRowHTML=`
      <div class="record">
        <input type="text" class="id _"><!--
     --><input type="text" class="name _ _find _new _modify _first _request"><!--
     --><input type="password" class="password _ _find _new _modify _request"><!--
     --><input type="password" class="password _ _find _new _modify"><!--
     --><select class="level _ _new _modify _request"><option value="admin">ADMIN</option><option value="guest">GUEST</option></select><!--
     --><input type="text" class="icon _">
      </div>
    `;

    this.order.HTML+=`
      <option value="name">ΟΝΟΜΑ</option>
    `;
    this.order.field='name';
    this.order.asc_desc='ASC';

    this.find=[
      {name:'name', value:'%'},
      {name:'level', value:''}
    ];

    this.url.new='/users/new'; 
    this.url.modify='/users/modify';
    this.url.delete='/users/delete';
    this.url.find='/users/find'; 
    this.url.count='/users/count';
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
      request('/users/icon', {id: this.elmCard.querySelector('input.id').value})
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