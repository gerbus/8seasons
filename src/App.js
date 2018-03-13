import React, { Component } from 'react';
import logo from './logo.svg';
import moment from 'moment';
import SunCalc from 'suncalc';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { EightSeason } from './8seasons.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current8season: null,
      currentDaylightHours: null,
      currentSunrise: null,
      currentSunset: null
    };
    this.handleTime = this.handleTime.bind(this);
  }
  componentWillMount() {
    let today = new Date();
    let sunData =  SunCalc.getTimes(today,49.2827,-123.1207);
    let daylightMilliseconds = sunData.sunset - sunData.sunrise;
    
    this.setState({
      current8season: new EightSeason(today),
      currentDaylightHours: moment.duration(daylightMilliseconds).hours() + " hours " + moment.duration(daylightMilliseconds).minutes() + " minutes",
      currentSunrise: moment(sunData.sunrise).format("HH:mm"),
      currentSunset: moment(sunData.sunset).format("HH:mm")
    })
    
    setInterval(this.handleTime, 1000);
  }
  handleTime() {
    let today = new Date();
    this.setState({currentTime: moment(today).format("YYYY-MM-DD HH:mm:ss")});
  }
  render() {
    return(
      <div className="container">
        <div className="title">
          <h1>The 8 Seasons</h1>
          <h3>That's right: eight. I need a higher resolution to my year. The Sami did it. Come on, let's do eight seasons per year.</h3>
        </div>
        <div className="seasons">
          <ProximateSeasons />
        </div>
      </div>
    );
  }
}


class ProximateSeasons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasons: []
    };
  }
  componentWillMount() {
    const seasons = this.getSeasons(9);
    this.setState({seasons: seasons});
  }
  render() {
    return (
      <table>
        <tbody>
          {this.state.seasons.map((season,index) => {
            //console.log(season);
            return (
              <tr key={index} className={season.isCurrent ? "current" : null}>
                <td>
                  <span className="start">{moment(season.startDate).format("YYYY-MM-DD")}</span>
                  {season.isCurrent ? <span className="now">You are here >>></span> : null}
                </td>
                <td>
                  <span className="name">{season.name.fourByTwo}</span>
                  <span className="year">{this.getYearSpan(season)}</span>
                </td>
              </tr>  
            )
          })}
        </tbody>
      </table>
    )
  }
  getSeasons(n) {
    let seasons = [];
    let currentSeason = new EightSeason(new Date());
    currentSeason.isCurrent = true;
    seasons.push(currentSeason);
    
    // Build previous and next seasons
    let previousSeasons = [];
    let nextSeasons = [];    
    const nPrevious = Math.floor((n-1)/2);  // opt to give previous seasons one less than next seasons
    const nNext = Math.ceil((n-1)/2); // opt to give next seasons one more than previous seasons
    
    let previousSeasonDate = new Date(moment(currentSeason.startDate).subtract(2,"day").valueOf());
    let nextSeasonDate = new Date(moment(currentSeason.endDate).add(2,"day").valueOf());
    for (let i = 0; i < nPrevious; i++) {
      let previousSeason = new EightSeason(previousSeasonDate);
      previousSeason.isCurrent = false;
      seasons.unshift(previousSeason);
      // Setup for next loop
      previousSeasonDate = new Date(moment(previousSeason.startDate).subtract(2,"day").valueOf());
    }
    for (let i = 0; i < nNext; i++) {
      let nextSeason = new EightSeason(nextSeasonDate);
      nextSeason.isCurrent = false;
      seasons.push(nextSeason);
      // Setup for next loop
      nextSeasonDate = new Date(moment(nextSeason.endDate).add(2,"day").valueOf());
    }
    
    return seasons;
  }
  getYearSpan(season) {
    if (season.startYear === season.endYear) {
      return season.startYear;
    } else {
      return season.startYear + '/' + season.endYear;
    }
  }
}


export default App;
