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
          <h3>I need a higher resolution to my year. The Sami people already did it. There's more to the changing of seasons than you think.</h3>
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
      <table className="table table-sm mt-5">
        <tbody>
          {this.state.seasons.map((season,index) => {
            return (
              <tr key={index} className={season.isCurrent ? "current " + season.name.fourByTwo : season.name.fourByTwo}>
                <td className="name">
                  <span>{season.name.fourByTwo}</span>
                  <span className="year">{this.getYearSpan(season)}</span>
                </td>
                <td className="date">
                  <span className="start">{moment(season.dateStart).format("YYYY-MMM-DD")}</span>
                </td>           
                <td className="today">
                  {season.isCurrent ? (
                      <span 
                        className="now"
                        style={{marginTop: this.getPercentThroughEightSeason(season,new Date()) }}>
                      &lt;&lt;&lt; You are here</span>
                    ) : null}
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
    
    /*const nPrevious = Math.floor((n-1)/2);  // opt to give previous seasons one less than next seasons
    const nNext = Math.ceil((n-1)/2); // opt to give next seasons one more than previous seasons
    
    let previousSeasonDate = new Date(moment(currentSeason.dateStart).subtract(2,"day").valueOf());
    let nextSeasonDate = new Date(moment(currentSeason.dateEnd).add(2,"day").valueOf());
    for (let i = 0; i < nPrevious; i++) {
      let previousSeason = new EightSeason(previousSeasonDate);
      previousSeason.isCurrent = false;
      seasons.unshift(previousSeason);
      // Setup for next loop
      previousSeasonDate = new Date(moment(previousSeason.dateStart).subtract(2,"day").valueOf());
    }
    for (let i = 0; i < nNext; i++) {
      let nextSeason = new EightSeason(nextSeasonDate);
      nextSeason.isCurrent = false;
      seasons.push(nextSeason);
      // Setup for next loop
      nextSeasonDate = new Date(moment(nextSeason.dateEnd).add(2,"day").valueOf());
    }*/
    
    const nNext = n - 1;
    let nextSeasonDate = new Date(moment(currentSeason.dateEnd).add(2,"day").valueOf());
    for (let i = 0; i < nNext; i++) {
      let nextSeason = new EightSeason(nextSeasonDate);
      nextSeason.isCurrent = false;
      seasons.push(nextSeason);
      // Setup for next loop
      nextSeasonDate = new Date(moment(nextSeason.dateEnd).add(2,"day").valueOf());
    }
    
    return seasons;
  }
  getYearSpan(season) {
    if (season.yearStart === season.yearEnd) {
      return season.yearStart;
    } else {
      return season.yearStart + '/' + season.yearEnd;
    }
  }
  getPercentThroughEightSeason(eightSeason, date) {
    let fullSeasonHeight = 100;
    let start = eightSeason.dateStart.valueOf();
    let end = eightSeason.dateEnd.valueOf();
    let now = date.valueOf();
    
    if (now <= end && now >= start) {
      // interpolate
      let percentage = (now - start) / (end - start);
      return Math.floor(fullSeasonHeight * percentage) + "px";
    }
    return null;
  }
}


export default App;
