//hdate.js

class HDate {
  constructor() {
  }
  static raw(date) {return date.substr(6,4))+date.substr(3,2))+date.substr(0,2));}

  static year(rawDate) {return parseInt(rawDate.substr(0,4));}
  static month(rawDate) {return parseInt(rawDate.substr(4,2));}
  static day(rawDate) {return parseInt(rawDate.substr(6,2));}

  static year366(year) {return (year%4===0 && year%100!==0) || (year%100===0 && year%400===0)?true:false;}
  static maxDay(month, year=null) {return (month===2 && HDate.year366(year))?29:[31,28,31,30,31,30,31,31,30,31,30,31][month-1];}

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