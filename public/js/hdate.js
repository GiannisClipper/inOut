//hdate.js

class HDate {
  constructor() {
  }
  static raw(date) {return date.substr(6,4)+date.substr(3,2)+date.substr(0,2);}
  static numToRaw(year, month, day) {return (year+'').padStart(4, '0')+(month+'').padStart(2, '0')+(day+'').padStart(2, '0');}

  static year(rawDate) {return parseInt(rawDate.substr(0,4));}
  static month(rawDate) {return parseInt(rawDate.substr(4,2));}
  static day(rawDate) {return parseInt(rawDate.substr(6,2));}

  static year366(year) {
    (typeof year==='string')?year=HDate.year(year):null;
    return (year%4===0 && year%100!==0) || (year%100===0 && year%400===0)?true:false;
  }
  static maxDay(month, year=null) {
    (typeof month==='string')?year=HDate.year(month):null;
    (typeof month==='string')?month=HDate.month(month):null;
    return (month===2 && HDate.year366(year))?29:[31,28,31,30,31,30,31,31,30,31,30,31][month-1];
  }

  static skipMonth(rawDate, counter=1) {
    let year=HDate.year(rawDate);
    let month=HDate.month(rawDate);
    year+=Math.floor(counter/12);
    month+=counter%12;
    month>12?year+=1:null;
    month>12?month-=12:null;
    month<1?year-=1:null;
    month<1?month=12-month:null;
    return year+(month+'').padStart(2, '0');
  }

  static skipDay(rawDate, counter=1) {
    let year=HDate.year(rawDate);
    let month=HDate.month(rawDate);
    let day=HDate.day(rawDate);
    if (day+counter>=1 && day+counter<=HDate.maxDay(month, year)) {
      day+=counter;
      return HDate.numToRaw(year, month, day);
    } else if (day+counter<1) {
      counter+=day;
      rawDate=HDate.skipMonth(rawDate, -1);
      year=HDate.year(rawDate);
      month=HDate.month(rawDate);
      day=HDate.maxDay(month, year);
      return HDate.skipDay(HDate.numToRaw(year, month, day), counter);
    } else if (day+counter>HDate.maxDay(month, year)) {
      counter-=HDate.maxDay(month, year)-day+1;
      rawDate=HDate.skipMonth(rawDate, 1);
      year=HDate.year(rawDate);
      month=HDate.month(rawDate);
      day=1;
      return HDate.skipDay(HDate.numToRaw(year, month, day), counter);
    }
  }

  static months(from, till) {
    let retval=(HDate.year(till)-HDate.year(from)+1)*12;
    retval-=HDate.month(from)-1;
    retval-=12-HDate.month(till);
    return retval;
  }

  static days(from, till) {
    let retval=0;
    for (let y=HDate.year(from); y<=HDate.year(till); ++y)
      retval+=HDate.year366(y)?366:365;
    
    retval-=HDate.day(from)-1;
    for (let m=1; m<HDate.month(from); ++m)
      retval-=HDate.maxDay(m, HDate.year(from));

    retval-=HDate.maxDay(HDate.month(till), HDate.year(till))-HDate.day(till);
    for (let m=HDate.month(till)+1; m<=12; ++m)
      retval-=HDate.maxDay(m, HDate.year(till));

    return retval;
  }
}

module.exports=HDate;
