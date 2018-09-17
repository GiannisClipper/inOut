//graph.js

class Graph {
  constructor(passval) {
    this.svgVal=null;
    if (passval) this.svg=passval;
    this.margin={top:null, left:null, bottom:null, right:null};
    this.range={steps:10, from:null, till:null, all:function() {return this.till-this.from;}};
    this.items={steps:12};
    this.title='';
    this.data=null;
  }

  set svg(passval) {this.svgVal=passval;}
  get svg() {return this.svgVal;}

  set width(passval) {}
  get width() {return parseInt(window.getComputedStyle(this.svg).getPropertyValue('width'))}; //this.svg.width.animVal.value;}

  set height(passval) {}
  get height() {return parseInt(window.getComputedStyle(this.svg).getPropertyValue('height'))}; //this.svg.height.animVal.value;}

  get marginT() {return (this.margin.top!==null)?this.margin.top:parseFloat(this.height)/10;}
  set marginT(passval) {this.margin.top=passval;}

  get marginL() {return (this.margin.left!==null)?this.margin.left:parseFloat(this.width)/10;}
  set marginL(passval) {this.margin.left=passval;}

  get marginB() {return (this.margin.bottom!==null)?this.margin.bottom:parseFloat(this.height)/20;}
  set marginB(passval) {this.margin.bottom=passval;}

  get marginR() {return (this.margin.right!==null)?this.margin.right:parseFloat(this.width)/20;}
  set marginR(passval) {this.margin.right=passval;}

  graphWidth() {return parseFloat(this.width)-this.marginL-this.marginR;}
  graphHeight() {return parseFloat(this.height)-this.marginT-this.marginB;}

  roundIntUp(num) {
    num=Math.ceil(num);
    let pow=num.toString().length-(num<0?2:1);
    num/=Math.pow(10, pow);
    num=Math.ceil(num);
    num*=Math.pow(10, pow);
    return num;
  }

  calcRange() {
    if (!this.range.from || !this.range.till) {
      this.range.from=0;
      this.range.till=0;
      for (let row of this.data) { 
        parseFloat(row.amount)<this.range.from?this.range.from=row.amount:null;
        parseFloat(row.amount)>this.range.till?this.range.till=row.amount:null;
      }
    let step=this.roundIntUp((this.range.all())/this.range.steps);
    this.range.steps=Math.ceil(this.range.all()/step)+1; 
    this.range.from=step*Math.floor(this.range.from/step);
    this.range.till=this.range.from+(step*this.range.steps);
   }
  }

  calcItems() {
  }

  drawRange() {
    let retval='';
    let x1=0;
    let y1=0;
    let x2=0;
    let y2=0;
    for (let i=0; i<=this.range.steps; ++i) {
      x1=this.marginL;
      x2=this.marginL+this.graphWidth();
      y1=this.marginT+this.graphHeight()-(i*(this.graphHeight()/this.range.steps));
      y2=this.marginT+this.graphHeight()-(i*(this.graphHeight()/this.range.steps));
      retval+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:rgb(128, 128, 128); stroke-width:1" />`;
      retval+=`<text x="${x1-5}" y="${y1+5}" text-anchor="end" transform="rotate(345, ${x1-5}, ${y1+5})">${Math.floor(this.range.from+(Math.abs(this.range.till-this.range.from)/this.range.steps*i))}</text>`;
    }
    return retval;
  }

  drawItems() {
    let retval='';
    return retval;
  }

  drawGraph() {
    let retval='';
    return retval;
  }

  process() {
    this.calcRange();
    this.calcItems();
//    let retval=`<svg class="${this.className}" style="height:${this.height}; width:${this.width};">`;
    let retval=``;
    retval+=`<text class="title" x="${(this.marginL+this.graphWidth()+this.marginR)/2}" y="${this.marginT/2}" text-anchor="middle">${this.title}</text>`;
    retval+=this.drawRange();
    retval+=this.drawItems();
    retval+=this.drawGraph();
//    retval+=`</svg>`;
    return retval;
  }
}

class GraphScale extends Graph {
  constructor(passval) {
    super(passval);
    this.items.labels=[];
  }

  calcItems() {
    if (HDate.days(this.data[0].date, this.data[this.data.length-1].date)<=31) {
      this.items.steps=HDate.days(this.data[0].date, this.data[this.data.length-1].date);
      for (let i=0; i<this.items.steps; i++)
        this.items.labels.push(HDate.day(HDate.skipDays(this.data[0].date,i)));
    }
    else if (HDate.months(this.data[0].date, this.data[this.data.length-1].date)<=12) {
      this.items.steps=HDate.months(this.data[0].date, this.data[this.data.length-1].date);
      for (let i=0; i<this.items.steps; i++)
        this.items.labels.push(HDate.monthName(HDate.month(HDate.skipMonths(this.data[0].date,i))).substr(0,3));
    }
  }

  drawItems() {
    let retval='';
    let xWidth=this.graphWidth()/HDate.days(this.data[0].date, this.data[this.data.length-1].date);
    let x1=0;
    let y1=0;
    let x2=0;
    let y2=0;
    let itemDate=null;
    for (let i=0; i<=this.items.steps; ++i) {
      if (HDate.days(this.data[0].date, this.data[this.data.length-1].date)<=31)
        itemDate=HDate.skipDays(this.data[0].date,i-1);
      else {
        itemDate=HDate.skipMonths(this.data[0].date,i-1);
        itemDate=HDate.numToRaw(HDate.year(itemDate), HDate.month(itemDate), HDate.maxDay(HDate.month(itemDate), HDate.year(itemDate)));
      }
      x1=Math.floor(this.marginL+(HDate.days(this.data[0].date, itemDate)*xWidth));
      x2=Math.floor(this.marginL+(HDate.days(this.data[0].date, itemDate)*xWidth));
      y1=this.marginT;
      y2=this.marginT+this.graphHeight();
      retval+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:rgb(128, 128, 128); stroke-width:1" />`;
      if (i>0) {
        x1-=this.graphWidth()/this.items.steps/2;
        y1=this.marginT+this.graphHeight()+(this.marginB/2);
        retval+=`<text x="${x1}" y="${y1}" text-anchor="middle" transform="rotate(345, ${x1}, ${y1})">${this.items.labels[i-1]}</text>`;
      }
    }
    return retval;
  }

  drawGraph() {
    let retval='';
    let xWidth=this.graphWidth()/HDate.days(this.data[0].date, this.data[this.data.length-1].date);
    let x=0;
    let y=0;
    let points='';
    for (let i=0; i<this.data.length; i++) {
      x=Math.floor(this.marginL+(HDate.days(this.data[0].date, this.data[i].date)*xWidth)-(xWidth/2));
      y=Math.floor(this.marginT+this.graphHeight()-(this.graphHeight()*Math.abs((this.data[i].amount-this.range.from)/this.range.all())));
      points+=`${x},${y} `;
    }
    retval+=`<polyline points="${points}" style="fill:none; stroke:black; stroke-width:1" />`;
    return retval;
  }
}

class GraphBars extends Graph {
  constructor(passval) {
    super(passval);
    this.items.steps=8;
    this.range.tillSum=false;
  }

  calcRange() {
    if (!this.range.tillSum)
      super.calcRange();
    else {
      this.range.from=0;
      this.range.till=0;
      for (let row of this.data)
        this.range.till+=parseFloat(row.amount);
      let step=this.roundIntUp((this.range.all())/this.range.steps);
      this.range.steps=Math.ceil(this.range.all()/step)+1; 
      this.range.till=this.range.from+(step*this.range.steps);
    }
  }

  calcItems() {
    this.items.steps=Math.min(this.items.steps, this.data.length);
    if (this.items.steps<this.data.length) {
      this.data[this.items.steps-1].name='ΛΟΙΠΑ';
      for (let i=this.items.steps; i<this.data.length; i++)
        this.data[this.items.steps-1].amount+=this.data[i].amount;
      this.data[this.items.steps-1].percent=100;
      for (let i=0; i<this.items.steps-1; i++)
        this.data[this.items.steps-1].percent-=parseInt(this.data[i].percent);
      this.data[this.items.steps-1].percent=this.data[this.items.steps-1].percent.toFixed(0)+'%';
    }
  }

  drawItems() {
    let retval='';
    retval+=`<line x1="${this.marginL}" y1="${this.marginT}" x2="${this.marginL}" y2="${this.marginT+this.graphHeight()}" style="stroke:rgb(128, 128, 128); stroke-width:1" />`;
    retval+=`<line x1="${this.marginL+this.graphWidth()}" y1="${this.marginT}" x2="${this.marginL+this.graphWidth()}" y2="${this.marginT+this.graphHeight()}" style="stroke:rgb(128, 128, 128); stroke-width:1" />`;

    let itemWidth=this.graphWidth()/this.items.steps;
    let gap=Math.ceil(itemWidth/20);
    itemWidth-=gap*2;
    let x=0;
    let y=0;
    for (let i=0; i<this.items.steps; ++i) {
      x=this.marginL+(i*(gap+itemWidth+gap))+gap+(itemWidth/(1+this.items.steps/10));
      y=this.marginT+this.graphHeight()+(this.marginB/3);
      retval+=`<text x="${x}" y="${y}" text-anchor="end" transform="rotate(${360-this.items.steps*2}, ${x}, ${y})">${this.data[i].name.substr(0,12)}</text>`;
    }
    return retval;
  }

  drawGraph() {
    let retval='';
    let x=0;
    let y=0;
    let itemHeight=0;
    let itemWidth=this.graphWidth()/this.items.steps;
    let gap=Math.ceil(itemWidth/20);
    itemWidth-=gap*2;
    let zeroBase=this.range.till/this.range.all()*this.graphHeight();
    for (let i=0; i<this.items.steps; ++i) {
      itemHeight=this.graphHeight()*this.data[i].amount/this.range.all();
      x=this.marginL+(i*(gap+itemWidth+gap))+gap;
      y=this.marginT+zeroBase-(itemHeight>0?itemHeight:0);
      retval+=`<rect class="${!this.data[i].className?'':this.data[i].className}" x="${x}" y="${y}" width="${itemWidth}" height="${Math.abs(itemHeight)}" />`;
      x+=itemWidth/2;
      y-=(y<this.marginT+16)?-16:5;
      retval+=`<text x="${x}" y="${y}" text-anchor="middle">${this.data[i].percent}</text>`;
    }
    return retval;
  }
}
