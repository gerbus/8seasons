// https://hermetic.ch/eqsol/eqsol.htm

const Solstice = require('../node_modules/astronomia/lib/solstice.js');
const Julian = require('../node_modules/julian/index.js');

export function get8Season(date) {
  switch (get8SeasonIndex(date)) {
    case 0:
      return "Winter 1";
      break;
    case 1:
      return "Winter 2";
      break;
    case 2:
      return "Spring 1";
      break;
    case 3:
      return "Spring 2";
      break;
    case 4:
      return "Summer 1";
      break;
    case 5:
      return "Summer 2";
      break;
    case 6:
      return "Autumn 1";
      break;
    case 7:
      return "Autumn 2";
      break;
  }
}
export function getSamiSeason(date) {
  switch (get8SeasonIndex(date)) {
    case 0:
      return "Winter";
      break;
    case 1:
      return "Late Winter";
      break;
    case 2:
      return "Spring";
      break;
    case 3:
      return "Early Summer";
      break;
    case 4:
      return "Summer";
      break;
    case 5:
      return "Late Summer";
      break;
    case 6:
      return "Autumn";
      break;
    case 7:
      return "Early Winter";
      break;
  }
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

function get8SeasonIndex(date) {
  let year = date.getFullYear();
  
  // Run through dates and return correct index
  if (date >= getWinter1(year)) {
    return 0;
  } else if (date >= getAutumn2(year)) {
    return 7;
  } else if (date >= getAutumn1(year)) {
    return 6;
  } else if (date >= getSummer2(year)) {
    return 5;
  } else if (date >= getSummer1(year)) {
    return 4;
  } else if (date >= getSpring2(year)) {
    return 3;
  } else if (date >= getSpring1(year)) {
    return 2;
  } else if (date >= getWinter2(year)) {
    return 1;
  } else {
    return 0;
  }
}