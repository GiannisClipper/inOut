//relation.js

class Relation {
  constructor() {
    this.parent=null;
    this.idClass=null;
    this.nameClass=null;
    this.listClass=null;
    this.url=null;
    this.onSelect=null;
  }

  init(parent, onSelect=null) {
    this.parent=parent;
    this.parent.querySelector(this.nameClass).onfocus=(e)=> this.onFocus(e);
    this.parent.querySelector(this.nameClass).onblur=(e)=> this.onBlur(e);
    this.onSelect=onSelect;
  }
 
  composeListItem(values) {
    return `<li><input type='button' class='name' value=${values.name}>
      <span class='id' style="display: none;">${values.id}</span></li>`;
  }

  fillChoice(data=null, listItemPos=0) {
    this.parent.querySelector(this.idClass).value=!data?'':data[listItemPos].id;
    this.parent.querySelector(this.nameClass).value=!data?'':data[listItemPos].name;
    if (this.onSelect) this.onSelect(data, listItemPos);
  }

  onFocus(e) {
    e.target._value=e.target.value;
  }

  onBlur(e) {
    if (e.target.value===e.target._value) {
      this.parent.querySelector(this.idClass).value===''?e.target.value='':null;
      if (!e.target.value)
        this.fillChoice();
    } else {
      this.parent.querySelector(this.idClass).value='';
      if (e.target.value!=='') {
        request(this.url, {find: [{'name':(e.target.value.indexOf('%')>=0?'name':'code'), 'value': e.target.value}]})
        .then(data=> {
          if (data.error) throw data;
          if (data.length===1)
            this.fillChoice(data, 0);
          else {
            this.parent.querySelector(this.listClass).style.display='block';
            this.parent.querySelector(this.listClass).style.overflow='auto';
            this.parent.querySelector(this.listClass).innerHTML='';
            data.forEach(x=> this.parent.querySelector(this.listClass).innerHTML+=this.composeListItem(x));
            this.parent.querySelector(this.listClass).querySelectorAll('INPUT').forEach((x,i)=> x.onclick=(e)=> {
              this.parent.querySelector(this.listClass).style.display='none';
              this.fillChoice(data, i);
            });
            this.parent.querySelector(this.listClass).querySelectorAll('INPUT').forEach((x,i)=> x.onblur=(e)=> {
              this.onBlurList(e);
            });
//            window.focus();
            this.parent.querySelector(this.listClass).querySelector('INPUT').focus();
          }
        })
        .catch(error=> alert((error.error)?error.error:error))
        .finally(()=> e.target.value!=='' && 
          this.parent.querySelector(this.idClass).value==='' &&
          this.parent.querySelector(this.listClass).style.display==='none'?e.target.focus():null
        );
      }
    }
  }

  onBlurList(e) {
    setTimeout(()=> {
    if (!this.parent.querySelector(this.listClass).querySelector(':focus'))
      this.parent.querySelector(this.listClass).style.display='none';
    }, 10);
  }
}

class FundRelation extends Relation {
  constructor() {
    super();
    this.codeHTML=`<!--
   --><input type="text" class="fund_name _ _find _new _modify"><!--
   --><div class="fund_tools" style="display: inline-block; width: 0px; height: 0px;"><!--
     --><input type="text" class="fund_id _ _request" style="display: none;"><!--
     --><ul class="fund_list _" style="display: none;"></ul><!--
   --></div><!--
 -->`;
  }

  init(parent, onSelect) {
    this.idClass='.fund_id';
    this.nameClass='.fund_name';
    this.listClass='.fund_list';
    this.url='/funds/find';
    super.init(parent, onSelect);
  }
}

class GenreRelation extends Relation {
  constructor() {
    super(parent);
    this.codeHTML=`<!--
   --><input type="text" class="genre_name _ _find _new _modify"><!--
   --><div class="fund_tools" style="display: inline-block; width: 0px; height: 0px;"><!--
     --><input type="text" class="genre_id _ _request" style="display: none;"><!--
     --><ul class="genre_list _" style="display: none;"></ul><!--
     --><input type="text" class="genre_inout" style="display: none;"><!--
     --><input type="text" class="genre_fund_id" style="display: none;"><!--
   --></div><!--
 -->`;
  }

  init(parent, onSelect) {
    this.idClass='.genre_id';
    this.nameClass='.genre_name';
    this.listClass='.genre_list';
    this.url='/genres/find';
    super.init(parent, onSelect);
  }

  composeListItem(values) {
    return `<li><input type='button' class='name' value=${values.name}>
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