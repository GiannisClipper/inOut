//relation.js

class Relation {
  constructor() {
    this.parent=null;
    this.elmId=null;
    this.elmName=null;
    this.elmArrow=null;
    this.elmList=null;
    this.url=null;
    this.onSelect=null;
  }

  init(parent, onSelect=null) {
    this.parent=parent;
    this.elmId=this.parent.querySelector(this.elmId);
    this.elmName=this.parent.querySelector(this.elmName);
    this.elmArrow=this.parent.querySelector(this.elmArrow);
    this.elmList=this.parent.querySelector(this.elmList);

    this.elmName.onfocus=(e)=> this.onFocus(e);
    this.elmName.onblur=(e)=> this.onBlur(e);
    this.elmName.onkeydown=(e)=> e.which===40?this.openList(e):e.which===38?this.closeList():null;
    this.elmArrow.onclick=(e)=> findClass(e.target, 'down')?this.openList({target:this.elmName}):this.closeList();
//     this.elmArrow.onclick=(e)=> alert(this.elmName.className);

    this.elmName.parentObject=this;
    this.onSelect=onSelect;
  }
   
  composeListItem(values) {
    return `<li><input type='button' class='name' value='${values.name}'>
      <span class='id' style="display: none;">${values.id}</span></li>`;
  }

  fillChoice(data=null, listItemPos=0) {
    this.elmId.value=!data?'':data[listItemPos].id;
    this.elmId._value=this.elmId.value;
    this.elmName.value=!data?'':data[listItemPos].name;
    this.elmName._value=this.elmName.value;
    this.onSelect?this.onSelect(data, listItemPos):null;
  }

  onFocus(e) {
    e.target._value=e.target.value;
    this.elmId._value=this.elmId.value;
  }

  onBlur(e) {
    setTimeout(()=>findClass(this.elmArrow, 'down') && (e.target.value!==e.target._value || this.elmId.value!==this.elmId._value)?this.fillChoice():null, 300);
  }

  openList(e) {
    replaceClass(this.elmArrow, 'down', 'up');
    if (e.target.value!=='' && (e.target.value!==e.target._value || this.elmId.value!==this.elmId._value)) {
      request(this.url, {find: [{'name':(e.target.value.indexOf('%')>=0?'name':'code'), 'value': e.target.value}]})
      .then(data=> {
        if (data.error) throw data;
        if (data.length===1) {
          this.fillChoice(data, 0);
          this.closeList();
        } else {
          this.elmList.style.width=this.elmName.offsetWidth;
          this.elmList.style.marginLeft=-this.elmName.offsetWidth;

          this.elmList.style.display='block';
          this.elmList.style.overflow='auto';
          this.elmList.innerHTML='';
          data.forEach(x=> this.elmList.innerHTML+=this.composeListItem(x));
          this.elmList.querySelectorAll('INPUT').forEach((x,i)=> x.onclick=(e)=> {
            this.fillChoice(data, i);
            this.closeList();
            this.elmName.focus();
          });
          this.elmList.querySelector('INPUT').focus();
        }
      })
      .catch(error=> {
        alert((error.error)?error.error:error);
        this.closeList();
      });
    } else 
      this.closeList();
  }

  closeList() {
    this.elmList.style.display='none';
    replaceClass(this.elmArrow, 'up', 'down');
  }

}

class FundRelation extends Relation {
  constructor() {
    super();
    this.codeHTML=`<!--
   --><input type="text" class="fund_name _ _find _new _modify _relation"><i class="fund_arrow arrow down"></i><!--
   --><div class="fund_tools" style="display: inline-block; width: 0px; height: 0px;"><!--
     --><input type="text" class="fund_id _ _request" style="display: none;"><!--
     --><ul class="fund_list _" style="display: none;"></ul><!--
   --></div><!--
 -->`;
  }

  init(parent, onSelect) {
    this.elmId='.fund_id';
    this.elmName='.fund_name';
    this.elmArrow='.fund_arrow';
    this.elmList='.fund_list';
    this.url='/funds/find';
    super.init(parent, onSelect);
  }
}

class GenreRelation extends Relation {
  constructor() {
    super(parent);
    this.codeHTML=`<!--
   --><input type="text" class="genre_name _ _find _new _modify _relation"><i class="genre_arrow arrow down"></i><!--
   --><div class="fund_tools" style="display: inline-block; width: 0px; height: 0px;"><!--
     --><input type="text" class="genre_id _ _request" style="display: none;"><!--
     --><input type="text" class="genre_inout _" style="display: none;"><!--
     --><input type="text" class="genre_fund_id" style="display: none;"><!--
     --><ul class="genre_list _" style="display: none;"></ul><!--
   --></div><!--
 -->`;
  }

  init(parent, onSelect) {
    this.elmId='.genre_id';
    this.elmName='.genre_name';
    this.elmArrow='.genre_arrow';
    this.elmList='.genre_list';
    this.url='/genres/find';
    super.init(parent, onSelect);
  }

  composeListItem(values) {
    return `<li><input type='button' class='name' value='${values.name}'>
      <span class='id' style="display: none;">${values.id}</span>
      <span class='inout' style="display: none;">${values.inout}</span>
      <span class='fund_id' style="display: none;">${values.fund_id}</span></li>`;
  }

  fillChoice(data=null, listItemPos=0) {
    this.parent.querySelector('.genre_inout').value=!data?'':data[listItemPos].inout;
    this.parent.querySelector('.genre_fund_id').value=!data?'':data[listItemPos].fund_id;
    super.fillChoice(data, listItemPos);
  }
}