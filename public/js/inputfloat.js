//inputfloat.js

class InputFloat {
  constructor(passval) {
    this.inputVal=null;
    this.seperateFloat='.';
    this.seperateFloats='~';
    this.decimals=2;
    this.range={from: 0, till: 0};
    this.align='right';
    if (passval) this.input=passval;
    this.splitedVal=null;
  }

  set input(passval) {
    this.inputVal=passval;
    this.input.parentObject=this;
    this.input.onfocus=(e)=> this.onFocus(e);
    this.input.onblur=(e)=> this.onBlur(e);
  }

  get input() {
    return this.inputVal;
  }
 
  onFocus(e) {
    this.input.style.textAlign='left';
    this.input._value=e.target.value;
  }

  onBlur(e) {
    this.input.style.textAlign=this.input.align;
    if (!this.valid()) e.target.value=this.input._value;
    this.splitedVal=null;
  }

  valid() {
    return (!this.input.value || (this.validForm() && this.validData()))?true:false;
  }

  validForm() {
    this.splitedVal=['',''];
    let _=0;
    for (let i=0; i<this.input.value.length; ++i) 
      if (('0123456789'.indexOf(this.input.value[i])>-1) ||
          (this.input.value[i]===this.seperateFloat && this.splitedVal[_].indexOf(this.seperateFloat)===-1) || 
          (this.input.value[i]==='-' && this.splitedVal[_].length===0))
        this.splitedVal[_]+=this.input.value[i];
      else if (_===0)
        _++;
      else if (this.splitedVal[1]!=='')
        break;
    return (this.splitedVal[0]?true:false);
  }

  validData() {
    for (let _=0; _<2; ++_)
      this.splitedVal[_]=this.splitedVal[_] &&
                         (!this.range.from || parseFloat(this.range.from)<=parseFloat(this.splitedVal[_])) &&
                         (!this.range.till || parseFloat(this.range.till)>=parseFloat(this.splitedVal[_])) &&
                         (!this.splitedVal[1] || parseFloat(this.splitedVal[1])>=parseFloat(this.splitedVal[_]))?parseFloat(this.splitedVal[_]).toFixed(this.decimals):'';

    if (this.splitedVal[0]) {
      this.input.value=this.from()+(this.till()?this.seperateFloats:'')+this.till();
      return true;
    }
    return false;
  }

  from() {
    let _=(this.splitedVal!==null)?this.splitedVal:(this.input.value?this.input.value.split(this.seperateFloats):'');
    return (_).length>0?_[0]:'';
  }

  till() {
    let _=(this.splitedVal!==null)?this.splitedVal:(this.input.value?this.input.value.split(this.seperateFloats):'');
    return (_).length>1?_[1]:'';
  }
}