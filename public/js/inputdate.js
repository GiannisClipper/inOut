//inputdate.js

class InputDate {
  constructor(passval) {
    this.inputVal=null;
    this.seperateDate='/';
    this.seperateDates='~';
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
    this.input._value=e.target.value;
  }

  onBlur(e) {
    if (!this.valid()) e.target.value=this.input._value;
    this.splitedVal=null;
  }

  valid() {
    return (!this.input.value || (this.validForm() && this.validData()))?true:false;
  }

  validForm() {
    this.splitedVal=this.input.value.match(/[0-9]+/g);
    (!this.splitedVal)?this.splitedVal=[]:null;

    if (this.splitedVal.length===1 && this.splitedVal[0].length===4) { //πχ. 2018 => 01/01/2018-31/12/2018
      this.splitedVal.splice(0, 0, '01');
      this.splitedVal.splice(1, 0, '01');
      this.splitedVal.splice(3, 0, '01');
      this.splitedVal.splice(4, 0, '12');
      this.splitedVal.splice(5, 0, this.splitedVal[2]);
      this.splitedVal[5]=this.fullYear(this.splitedVal[5]);
      this.splitedVal[3]=this.maxDay(this.splitedVal[4], this.splitedVal[5]);
    } else if (this.splitedVal.length===1 && this.splitedVal[0].length>=6) { //πχ. 17082018 ή 170818
      this.splitedVal.splice(0, 0, this.splitedVal[0].substr(0,2));
      this.splitedVal.splice(1, 0, this.splitedVal[1].substr(2,2));
      this.splitedVal[2]=this.splitedVal[2].substr(4);
    } else if (this.splitedVal.length===2 && this.splitedVal[1].length<4) { //πχ. 23/8 => 23/8/2018 (current year)
      this.splitedVal.splice(2, 0, (new Date()).getFullYear());
    } else if (this.splitedVal.length===2 && this.splitedVal[1].length<6) { //πχ. 8/2018 => 01/08/2018-31/08/2018
      this.splitedVal.splice(0, 0, '01');
      this.splitedVal.splice(3, 0, '01');
      this.splitedVal.splice(4, 0, this.splitedVal[1]);
      this.splitedVal.splice(5, 0, this.splitedVal[2]);
      this.splitedVal[5]=this.fullYear(this.splitedVal[5]);
      this.splitedVal[3]=this.maxDay(this.splitedVal[4], this.splitedVal[5]);
    } else if (this.splitedVal.length===2 && this.splitedVal[1].length>=6) { //πχ. 15-17082018 ή 1508-170818
      this.splitedVal.splice(0, 0, this.splitedVal[0].substr(0,2));
      this.splitedVal.splice(1, 0, this.splitedVal[1].substr(2,2));
      this.splitedVal[2]=this.splitedVal[2].substr(4);
      this.splitedVal.splice(3, 0, this.splitedVal[3].substr(0,2));
      this.splitedVal.splice(4, 0, this.splitedVal[4].substr(2,2));
      this.splitedVal[5]=this.splitedVal[5].substr(4);
      if (!this.splitedVal[1]) this.splitedVal[1]=this.splitedVal[4];
      if (!this.splitedVal[2]) this.splitedVal[2]=this.splitedVal[5];
    } else if (this.splitedVal.length===3) { //πχ. 17/8/2018 ή 17-8-18
    } else if (this.splitedVal.length===4) { //πχ. 15-17/8/2018 ή 15-17/8/18
      this.splitedVal.splice(1, 0, this.splitedVal[2]);
      this.splitedVal.splice(2, 0, this.splitedVal[4]);
    } else if (this.splitedVal.length===5) { //πχ. 15/8-17/8/2018 ή 15.8/17.8.18
      this.splitedVal.splice(2, 0, this.splitedVal[4]);
    } else return false;
    return true;
  }

  validData() {
    if (!(this.validYear(5) && this.validMonth(4) && this.validDay(3)))
      this.splitedVal.splice(3,3);
    if (!(this.validYear(2) && this.validMonth(1) && this.validDay(0)))
      this.splitedVal.splice(0,3);

    this.splitedVal=this.splitedVal.map(x=> (x+'').padStart(2, '0'));
    if (this.rawFrom>this.rawTill)
      this.splitedVal.splice(3,3);


    if (this.splitedVal.length>0) {
      this.input.value=this.from()+(this.till()?this.seperateDates:'')+this.till();
      return true;
    }
    return false;
  }

  validYear(i) {
    this.splitedVal[i]=this.fullYear(this.splitedVal[i]);
    if (parseInt(this.splitedVal[i])>=1900 && parseInt(this.splitedVal[i])<=2099)
      return true;
    return false;
  }

  fullYear(year) {
    if (parseInt(year)>=1900 && parseInt(year)<=2099) return year;
    else if (parseInt(year)>=0 && parseInt(year)<=99) return parseInt(year)<80?2000+parseInt(year):1900+parseInt(year);
    else return null;
  }

  validMonth(i) {
    if (parseInt(this.splitedVal[i])>=1 && parseInt(this.splitedVal[i])<=12)
      return true;
    return false;
  }

  validDay(i) {
    if (parseInt(this.splitedVal[i])>=1 && parseInt(this.splitedVal[i])<=this.maxDay(this.splitedVal[i+1], this.splitedVal[i+2]))
      return true;
    return false;
  }

  maxDay(month, year=null) {
    const _=[31,28,31,30,31,30,31,31,30,31,30,31];
    if (parseInt(month)===2 && ((year%4===0 && year%100!==0) || (year%100===0 && year%400===0)))
      return 29;
    else
      return _[parseInt(month)-1];
  }

  from() {
    let _=(this.splitedVal!==null)?this.splitedVal:(this.input.value?this.input.value.match(/[0-9]+/g):'');
    return (_.length>0)?_[0]+this.seperateDate+_[1]+this.seperateDate+_[2]:'';
  }

  till() {
    let _=(this.splitedVal!==null)?this.splitedVal:(this.input.value?this.input.value.match(/[0-9]+/g):'');
    return (_.length>3)?_[3]+this.seperateDate+_[4]+this.seperateDate+_[5]:'';
  }

  set raw(passval) {
    this.rawFrom=!passval?'':passval.substr(0,8);
    this.rawTill=!passval || passval.length<=8?'':passval.substr(-8,8);
  }

  get raw() {
    return this.rawFrom+this.rawTill;
  }

  set rawFrom(passval) { //αντιγράφει πχ. το 20180817 στην input.value ως 17/08/2018
    this.input.value=(!passval?'':passval.substr(6,2)+this.seperateDate+passval.substr(4,2)+this.seperateDate+passval.substr(0,4))+this.input.value.substr(10,11);
  }

  get rawFrom() {
    let _=(this.splitedVal!==null)?this.splitedVal:(this.input.value?this.input.value.match(/[0-9]+/g):'');
    return (_.length>0)?_[2]+_[1]+_[0]:'';
  }

  set rawTill(passval) { //αντιγράφει πχ. το 20180817 στην input.value ως 17/08/2018
    this.input.value=this.input.value.substr(0,10)+(!passval?'':this.seperateDates+passval.substr(6,2)+this.seperateDate+passval.substr(4,2)+this.seperateDate+passval.substr(0,4));
  }

  get rawTill() {
    let _=(this.splitedVal!==null)?this.splitedVal:(this.input.value?this.input.value.match(/[0-9]+/g):'');
    return (_.length>3)?_[5]+_[4]+_[3]:'';
  }
}