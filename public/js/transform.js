//transform.js

class TransForm extends Form {
  constructor(parent) {
    super(parent);
    this.dateCard=new DateInput();
    this.incomeCard=new FloatInput();
    this.outgoCard=new FloatInput();
    this.genreCard=new GenreRelation();
    this.fundCard=new FundRelation();
    this.cardHTML=`
      <div class="record">
        <div class="left">
          <div>ID</div><div><input type="text" class="id _"></div>
          <div>Ημ/νία</div><div><input type="text" class="date _ _find _new _modify _first _request"></div>
        </div>
        <div class="right">
          <div>Κατηγορία</div><div>${this.genreCard.codeHTML}</div>
          <div>Έσοδα</div><div><input type="text" class="income _ _find _new _modify _request"></div>
          <div>Έξοδα</div><div><input type="text" class="outgo _ _find _new _modify _request"></div>
          <div>Λογαριασμός</div><div>${this.fundCard.codeHTML}</div>
          <div>Παρατηρήσεις</div><div><input type="text" class="remarks _ _find _new _modify _request"></div>
        </div>
      </div>
    `;
    this.gridHeaderHTML=`
      <div class="titles">
        <span class="id">ID</span><span class="date">Ημ/νία</span><span class="genre_name">Κατηγορία</span><span class="income">Έσοδα</span><span class="outgo">Έξοδα</span><span class="fund_name">Λογαριασμός</span><span class="remarks">Παρατηρήσεις</span>
      </div>
    `;
    this.dateGrid=Array(this.gridLength).fill().map(x=> x=new DateInput());
    this.incomeGrid=Array(this.gridLength).fill().map(x=> x=new FloatInput());
    this.outgoGrid=Array(this.gridLength).fill().map(x=> x=new FloatInput());
    this.genreGrid=Array(this.gridLength).fill().map(x=> x=new GenreRelation());
    this.fundGrid=Array(this.gridLength).fill().map(x=> x=new FundRelation());
    this.gridRowHTML=`
      <div class="record">
        <input type="text" class="id _"><!--
     --><input type="text" class="date _ _find _new _modify _first _request"><!--
     -->${this.genreCard.codeHTML}<!--
     --><input type="text" class="income _ _find _new _modify _request"><!--
     --><input type="text" class="outgo _ _find _new _modify _request"><!--
     -->${this.fundCard.codeHTML}<!--
     --><input type="text" class="remarks _ _find _new _modify _request">
      </div>
    `;

    this.order.HTML+=`
      <option value="date">ΗΜ/ΝΙΑ</option>
      <option value="genre_id">ΚΑΤΗΓΟΡΙΑ</option>
      <option value="fund_id">ΛΟΓΑΡΙΑΣΜΟ</option>
    `;
    this.order.field='date';
    this.order.asc_desc='DESC';

    this.join=[
      {table:'genres', relation:'trans.genre_id=genres.id', fields:[{name:'name', alias:'genre_name'}, {name:'inout', alias:'genre_inout'}]},
      {table:'funds', relation:'trans.fund_id=funds.id', fields:[{name:'name', alias:'fund_name'}]}
    ];

    this.find=[
      {name:'date', value:'', range:this.dateCard.seperateDates},
      {name:'genre_id', value:''},
      {name:'genre_name', value:''},
      {name:'income', value:'', range:this.incomeCard.seperateFloats},
      {name:'outgo', value:'', range:this.outgoCard.seperateFloats},
      {name:'fund_id', value:''},
      {name:'fund_name', value:''},
    ];

    this.url.new='/trans/new'; 
    this.url.modify='/trans/modify';
    this.url.delete='/trans/delete';
    this.url.find='/trans/find'; 
    this.url.count='/trans/count';
    this.url.funds='/funds/find';
    this.genre_onSelect=()=> {
      this.elmRecord.querySelector('.income').disabled=(this.elmRecord.querySelector('.genre_inout').value!=='1')?true:false;
      this.elmRecord.querySelector('.genre_inout').value!=='1'?this.elmRecord.querySelector('.income').value='':null;
      this.elmRecord.querySelector('.outgo').disabled=(this.elmRecord.querySelector('.genre_inout').value!=='2')?true:false;
      this.elmRecord.querySelector('.genre_inout').value!=='2'?this.elmRecord.querySelector('.outgo').value='':null;
      this.elmRecord.querySelector('._request.fund_id').value=this.elmRecord.querySelector('.genre_fund_id').value;
      if (!this.elmRecord.querySelector('._request.fund_id').value)
        this.elmRecord.querySelector('.fund_name').value='';
      else
        request(this.url.funds, {find: [{'name':'id', 'value':this.elmRecord.querySelector('._request.fund_id').value}]})
        .then(data=> {
          if (data.error) throw data;
          this.elmRecord.querySelector('.fund_name').value=data[0].name;})
        .catch(error=> alert((error.error)?error.error:error));
    }
  }

  init() {
    super.init();

    this.dateCard.input=this.elmCard.querySelector('.date');
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> this.dateGrid[i].input=x.querySelector('.date'));
    this.incomeCard.input=this.elmCard.querySelector('.income');
    this.incomeCard.align='left';
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> this.incomeGrid[i].input=x.querySelector('.income'));
    this.outgoCard.input=this.elmCard.querySelector('.outgo');
    this.outgoCard.align='left';
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> this.outgoGrid[i].input=x.querySelector('.outgo'));

    this.genreCard.init(this.elmCard.querySelector('.record'), ()=> this.genre_onSelect());
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> this.genreGrid[i].init(x, ()=> {this.genre_onSelect();}));
    this.fundCard.init(this.elmCard.querySelector('.record'));
    this.elmGrid.querySelectorAll('.record').forEach((x,i)=> this.fundGrid[i].init(x));
    this.refresh();
  }

  clickModify() {
    super.clickModify();
    this.elmRecord.querySelector('.income').disabled=(this.elmRecord.querySelector('.genre_inout').value!=='1')?true:false;
    this.elmRecord.querySelector('.outgo').disabled=(this.elmRecord.querySelector('.genre_inout').value!=='2')?true:false;
  }

  okModify() {
    this.reqModify(()=> {
      this.cache[this.iView-this.offset].genre_name=this.elmRecord.querySelector('.genre_name').value;
      this.cache[this.iView-this.offset].fund_name=this.elmRecord.querySelector('.fund_name').value;
    });
  }
}