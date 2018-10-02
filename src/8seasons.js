/**
* This class library provides the tools for dealing with an eight season year.
*  An Eight-season is one of the eight seasons of the year.
*  Language in code is consistent with the four-by-two naming convention, 
*   in which each of the traditional four seasons is divided
*   into two sub-seasons (i.e. Winter 1 & Winter 2).
*  Usage: let season = new EightSeason(new Date());
*/

// https://hermetic.ch/eqsol/eqsol.htm
const Solstice = require('../node_modules/astronomia/lib/solstice.js');
const Julian = require('../node_modules/julian/index.js');

export default class eightSeason {
  constructor(date) {
    // Class skeleton
    this.yearStart = null;
    this.yearEnd = null;
    this.dateStart = null;
    this.dateEnd = null;
    this.index = null;
    this.name = {
      fourByTwo: null,
      sami: null
    }
    
    // Get all the Eight-season start dates for 
    //  the year of the supplied date
    let year = date.getFullYear();
    let winter2StartDate = getWinter2StartDate(year);
    let spring1StartDate = getSpring1StartDate(year);
    let spring2StartDate = getSpring2StartDate(year);
    let summer1StartDate = getSummer1StartDate(year);
    let summer2StartDate = getSummer2StartDate(year);
    let autumn1StartDate = getAutumn1StartDate(year);
    let autumn2StartDate = getAutumn2StartDate(year);
    let winter1StartDate = getWinter1StartDate(year);

    // Set default start and end year of the Eight-season
    this.yearStart = year;
    this.yearEnd = year;
    
    // Run (backwards) through Eight-seasons to find the one 
    //  containing the provided date
    if (date >= winter1StartDate) { 
      // Winter 1, the part near the end of the year
      this.index = 0;
      this.dateStart = winter1StartDate;
      this.yearEnd = year + 1;  // the end of winter 1 will be next year
      this.dateEnd = getWinter2StartDate(year + 1);  
    } else if (date >= autumn2StartDate) {
      // Autumn 2
      this.index = 7;
      this.dateStart = autumn2StartDate;
      this.dateEnd = winter1StartDate;
    } else if (date >= autumn1StartDate) {
      // Autumn 1
      this.index = 6;
      this.dateStart = autumn1StartDate;
      this.dateEnd = autumn2StartDate;
    } else if (date >= summer2StartDate) {
      // Summer 2
      this.index = 5;
      this.dateStart = summer2StartDate;
      this.dateEnd = autumn1StartDate;
    } else if (date >= summer1StartDate) {
      // Summer 1
      this.index = 4;
      this.dateStart = summer1StartDate;
      this.dateEnd = summer2StartDate;
    } else if (date >= spring2StartDate) {
      // Spring 2
      this.index = 3;
      this.dateStart = spring2StartDate;
      this.dateEnd = summer1StartDate;
    } else if (date >= spring1StartDate) {
      // Spring 1
      this.index = 2;
      this.dateStart = spring1StartDate;
      this.dateEnd = spring2StartDate;
    } else if (date >= winter2StartDate) {
      // Winter 2
      this.index = 1;
      this.dateStart = winter2StartDate;
      this.dateEnd = spring1StartDate;
    } else {  
      // Winter 1, the part near the beginning of the year
      this.index = 0;
      this.yearStart = year - 1;  // the start of winter 1 was last year
      this.dateStart = getWinter1StartDate(year - 1);  
      this.dateEnd = winter2StartDate;
    }

    // Set the name of the containing Eight-season
    this.name.fourByTwo = fourByTwoName[this.index];
    this.name.sami = samiName[this.index];
  }  
}

const fourByTwoName = ["Winter 1","Winter 2","Spring 1","Spring 2","Summer 1","Summer 2","Autumn 1","Autumn 2"];
const samiName = ["Winter","Late Winter","Spring","Early Summer","Summer","Late Summer","Autumn","Early Winter"];

export function getWinter1StartDate(year) {
  return Julian.toDate(Solstice.december(year));
}
export function getSpring1StartDate(year) {
  return Julian.toDate(Solstice.march(year));
}
export function getSummer1StartDate(year) {
  return Julian.toDate(Solstice.june(year));
}
export function getAutumn1StartDate(year) {
  return Julian.toDate(Solstice.september(year));
}
export function getWinter2StartDate(year) {
  let winter1 = getWinter1StartDate(year-1);
  let spring1 = getSpring1StartDate(year);
  return new Date(winter1.getTime() + (spring1.getTime() - winter1.getTime())/2);
}
export function getSpring2StartDate(year) {
  let spring1 = getSpring1StartDate(year);
  let summer1 = getSummer1StartDate(year);
  return new Date(spring1.getTime() + (summer1.getTime() - spring1.getTime())/2);
}
export function getSummer2StartDate(year) {
  let summer1 = getSummer1StartDate(year);
  let autumn1 = getAutumn1StartDate(year);
  return new Date(summer1.getTime() + (autumn1.getTime() - summer1.getTime())/2);
}
export function getAutumn2StartDate(year) {
  let autumn1 = getAutumn1StartDate(year);
  let winter1 = getWinter1StartDate(year);
  return new Date(autumn1.getTime() + (winter1.getTime() - autumn1.getTime())/2);
}
export function getSeasonStartDateByIndexAndYear(index, year = (new Date()).getFullYear()) {
  switch (index) {
    case 0:
      return getWinter2StartDate(year);
    case 1:
      return getSpring1StartDate(year);
    case 2:
      return getSpring2StartDate(year);
    case 3:
      return getSummer1StartDate(year);
    case 4:
      return getSummer2StartDate(year);
    case 5:
      return getAutumn1StartDate(year);
    case 6:
      return getAutumn2StartDate(year);
    case 7:
      return getWinter1StartDate(year);
  }
}