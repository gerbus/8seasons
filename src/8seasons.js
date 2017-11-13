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
function get8SeasonIndex(date) {
  let year = date.getFullYear();

  // Get solstice and equinox dates 
  let LastWinter = Julian.toDate(Solstice.december(year-1));  // Previous Winter Solstice
  let Spring = Julian.toDate(Solstice.march(year));
  let Summer = Julian.toDate(Solstice.june(year));
  let Autumn = Julian.toDate(Solstice.september(year));
  let Winter = Julian.toDate(Solstice.december(year));

  // Calculate cross-quarter dates (occur midway between solstices and equinoxes)
  let WinterSpringMedian = new Date(LastWinter.getTime() + (Spring.getTime() - LastWinter.getTime())/2);
  let SpringSummerMedian = new Date(Spring.getTime() + (Summer.getTime() - Spring.getTime())/2);
  let SummerAutumnMedian = new Date(Summer.getTime() + (Autumn.getTime() - Summer.getTime())/2);
  let AutumnWinterMedian = new Date(Autumn.getTime() + (Winter.getTime() - Autumn.getTime())/2);
  
  // Run through dates and return correct index
  if (date < WinterSpringMedian) {
    return 0;
  } else if (date < Spring) {
    return 1;
  } else if (date < SpringSummerMedian) {
    return 2;
  } else if (date < Summer) {
    return 3;
  } else if (date < SummerAutumnMedian) {
    return 4;
  } else if (date < Autumn) {
    return 5;
  } else if (date < AutumnWinterMedian) {
    return 6;
  } else if (date < Winter) {
    return 7;
  } else {
    return 0;
  }
}