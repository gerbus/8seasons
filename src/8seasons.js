// https://hermetic.ch/eqsol/eqsol.htm

const Solstice = require('../node_modules/astronomia/lib/solstice.js');
const Julian = require('../node_modules/julian/index.js');

const name = ["Winter 1","Winter 2","Spring 1","Spring 2","Summer 1","Summer 2","Autumn 1","Autumn 2"];
const samiName = ["Winter","Late Winter","Spring","Early Summer","Summer","Late Summer","Autumn","Early Winter"];

export function get8Season(date) {
  let data = get8SeasonInfo(date);
  return data.name;
}
export function getNext8Season(date) {
  let data = get8SeasonInfo(date);
  return name[data.index + 1];
}
export function getSamiSeason(date) {
  let data = get8SeasonInfo(date);
  return data.samiName;
}

export function getWinter1(year) {
  return Julian.toDate(Solstice.december(year)); 
}
export function getSpring1(year) {
  return Julian.toDate(Solstice.march(year));
}
export function getSummer1(year) {
  return Julian.toDate(Solstice.june(year));
}
export function getAutumn1(year) {
  return Julian.toDate(Solstice.september(year));
}

export function getWinter2(year) {
  let winter1 = getWinter1(year-1);
  let spring1 = getSpring1(year);
  return new Date(winter1.getTime() + (spring1.getTime() - winter1.getTime())/2);
}
export function getSpring2(year) {
  let spring1 = getSpring1(year);
  let summer1 = getSummer1(year);
  return new Date(spring1.getTime() + (summer1.getTime() - spring1.getTime())/2);
}
export function getSummer2(year) {
  let summer1 = getSummer1(year);
  let autumn1 = getAutumn1(year);
  return new Date(summer1.getTime() + (autumn1.getTime() - summer1.getTime())/2);
}
export function getAutumn2(year) {
  let autumn1 = getAutumn1(year);
  let winter1 = getWinter1(year);
  return new Date(autumn1.getTime() + (winter1.getTime() - autumn1.getTime())/2);
}

export function get8SeasonInfo(date) {
  let year = date.getFullYear();
  let winter2Start = getWinter2(year);
  let spring1Start = getSpring1(year);
  let spring2Start = getSpring2(year);
  let summer1Start = getSummer1(year);
  let summer2Start = getSummer2(year);
  let autumn1Start = getAutumn1(year);
  let autumn2Start = getAutumn2(year);
  let winter1Start = getWinter1(year);
  
  let data = {};
  // Run (backwards) through dates and return correct info
  if (date >= winter1Start) { // Today is in winter 1, near the end of the year
    data.index = 0;
    data.seasonStart = winter1Start;
    data.seasonEnd = getWinter2(year + 1);  // the end of winter 1 will be next year
  } else if (date >= autumn2Start) {
    data.index = 7;
    data.seasonStart = autumn2Start;
    data.seasonEnd = winter1Start;
  } else if (date >= autumn1Start) {
    data.index = 6;
    data.seasonStart = autumn1Start;
    data.seasonEnd = autumn2Start;
  } else if (date >= summer2Start) {
    data.index = 5;
    data.seasonStart = summer2Start;
    data.seasonEnd = autumn1Start;
  } else if (date >= summer1Start) {
    data.index = 4;
    data.seasonStart = summer1Start;
    data.seasonEnd = summer1Start;
  } else if (date >= spring2Start) {
    data.index = 3;
    data.seasonStart = spring2Start;
    data.seasonEnd = summer1Start;
  } else if (date >= spring1Start) {
    data.index = 2;
    data.seasonStart = spring1Start;
    data.seasonEnd = spring2Start;
  } else if (date >= winter2Start) {
    data.index = 1;
    data.seasonStart = winter2Start;
    data.seasonEnd = spring1Start;
  } else {  // Today is in winter 1, near the beginning of the year
    data.index = 0;
    data.seasonStart = getWinter1(year - 1);  // the start of winter 1 was last year
    data.seasonEnd = winter2Start;
  }
  
  data.seasonName = name[data.index];
  data.nextSeasonName = name[(data.index + 1) % 8]
  data.seasonNameSami = samiName[data.index];
  data.nextSeasonNameSami = samiName[(data.index + 1) % 8]
  
  return data;
}
