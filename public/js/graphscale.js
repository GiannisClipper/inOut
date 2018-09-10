//graphscale.js

class GraphScale {
  constructor(className=null) {
    this.className=className;
    this.width='400px';
    this.height='280px';
    this.margin={top:null, left:null, bottom:null, right:null};
    this.header='';
    this.footer='';
    this.hSteps=1;
    this.hLabels=[];
    this.vSteps=1;
    this.vRange={from:null, till:null};
    this.data=null;
    this.HDate=null;
  }

  get marginT() {return (this.margin.top!==null)?this.margin.top:parseFloat(this.height)/20;}
  set marginT(passval) {this.margin.top=passval;}

  get marginL() {return (this.margin.left!==null)?this.margin.left:parseFloat(this.width)/10;}
  set marginL(passval) {this.margin.left=passval;}

  get marginB() {return (this.margin.bottom!==null)?this.margin.bottom:parseFloat(this.height)/20;}
  set marginB(passval) {this.margin.bottom=passval;}

  get marginR() {return (this.margin.right!==null)?this.margin.right:parseFloat(this.width)/20;}
  set marginR(passval) {this.margin.right=passval;}

  graphWidth() {return parseFloat(this.width)-this.marginL-this.marginR;}
  graphHeight() {return parseFloat(this.height)-this.marginT-this.marginB;}

  roundIntDown(num) {
    num=Math.floor(num);
    num/=Math.pow(10, num.toString().length-(num<0)?2:1);
    num=Math.floor(num);
    num*=Math.pow(10, num.toString().length-(num<0)?2:1);
    return num;
  }

  roundIntUp(num) {
    num=Math.ceil(num);
    num/=Math.pow(10, num.toString().length-(num<0)?2:1);
    num=Math.ceil(num);
    num*=Math.pow(10, num.toString().length-(num<0)?2:1);
    return num;
  }

  process() {
    if (!this.vRange.from || !this.vRange.till) {
      for (row of this.data) { 
        this.vRange.from===null || row.amount<this.vRange.from?this.vRange.from=row.amount:null;
        this.vRange.till===null || row.amount>this.vRange.till?this.vRange.till=row.amount:null;
      }
      this.vRange.from=this.roundIntDown(this.vRange.from);
      this.vRange.till=this.roundIntUp(this.vRange.till);
    }

    if (this.HDate.days(this.data[0].date, this.data[this.data.length-1].date)<=31) {
      this.hSteps=this.HDate.days(this.data[0].date, this.data[this.data.length-1].date);
      for (let i=0; i<this.hSteps; i++)
        this.hLabels.push(this.HDate.day(this.HDate.skipDay(this.data[0].date,i)));
    }
    else if (this.HDate.months(this.data[0].date, this.data[this.data.length-1].date)<=12) {
      this.hSteps=this.HDate.months(this.data[0].date, this.data[this.data.length-1].date);
      for (let i=0; i<this.hSteps; i++)
        this.hLabels.push(this.HDate.month(this.HDate.skipMonth(this.data[0].date,i)));
    }

    let xWidth=this.graphWidth()/this.HDate.days(this.data[0].date, this.data[this.data.length-1].date);
    let x=0;
    let y=0;
    let points='';
    for (let i=0; i<this.data.length; i++) {
      x=Math.floor(this.marginL+(this.HDate.days(this.data[0].date, this.data[i].date)*xWidth));
      y=Math.floor(this.marginT+this.graphHeight()-(this.graphHeight()*Math.abs((this.data[i].amount-this.vRange.from)/(this.vRange.till-this.vRange.from))));
      points+=`${x},${y} `;
    }

    let retval=`<svg class="${this.className}" height="${this.height}" width="${this.width}">`;
    for (let i=0; i<=this.vSteps; ++i) {
      retval+=`<line x1="${this.marginL}" y1="${this.marginT+this.graphHeight()-(i*(this.graphHeight()/this.vSteps))}" x2="${this.marginL+this.graphWidth()}" y2="${this.marginT+this.graphHeight()-(i*(this.graphHeight()/this.vSteps))}" style="stroke:rgb(128,128,128);stroke-width:1" />`;
      retval+=`<text x="${this.marginL-5}" y="${this.marginT+this.graphHeight()-(i*(this.graphHeight()/this.vSteps))+5}" text-anchor="end" fill="red">${Math.floor(this.vRange.from+(Math.abs(this.vRange.till-this.vRange.from)/this.vSteps*i))}</text>`;
    }
    for (let i=0; i<=this.hSteps; ++i) {
      retval+=`<line x1="${this.marginL+(i*(this.graphWidth()/this.hSteps))}" y1="${this.marginT}" x2="${this.marginL+(i*(this.graphWidth()/this.hSteps))}" y2="${this.marginT+this.graphHeight()}" style="stroke:rgb(128,128,128);stroke-width:1" />`;
      if (i<this.hSteps)
        retval+=`<text x="${this.marginL+((i+0.5)*(this.graphWidth()/this.hSteps))}" y="${this.marginT+this.graphHeight()+this.marginB}" text-anchor="middle" fill="red">${this.hLabels[i]}</text>`;
    }
    retval+=`<polyline points="${points}" style="fill:none;stroke:black;stroke-width:1" />`;
    retval+=`</svg>`;
    return retval;
  }
}

module.exports=GraphScale;