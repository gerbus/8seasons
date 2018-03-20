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
    //this.handleTime = this.handleTime.bind(this);
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
    
    //setInterval(this.handleTime, 1000);
  }
  /*handleTime() {
    let today = new Date();
    this.setState({currentTime: moment(today).format("YYYY-MM-DD HH:mm:ss")});
  }*/
  render() {
    return(
      <div className="container">
        <div className="mt-3">
          <h1>The Eight Season Year</h1>
          <p>I need a higher resolution to my year. The Sami people already did it. There's more to the changing of seasons than you think.</p>
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
      seasons: [],
      now: new Date()
    };
    this.handleTime = this.handleTime.bind(this);
  }
  componentWillMount() {
    setInterval(this.handleTime, 1000);  // update once every second
  }
  handleTime() {
    const seasons = this.getSeasons(9);
    this.setState({seasons: seasons, now: new Date()});
  }
  render() {
    return (
      <table className="table table-sm mt-5">
        <tbody>
          {this.state.seasons.map((season,index) => {
            return (
              <tr key={index} className={season.isCurrent ? "current " + season.name.fourByTwo.replace(/ /g,'') : season.name.fourByTwo.replace(/ /g,'')}>
                <td className="name">
                  <span>{season.name.fourByTwo}</span>
                  <span className="year">{this.getYearSpan(season)}</span>
                </td>
                <td className="date">
                  <span className="start">{moment(season.dateStart).format("YYYY-MMM-DD HH:mm")}</span>
                </td>           
                <td className="today">
                  {season.isCurrent ? (
                      <span 
                        className="now"
                        style={{marginTop: this.getPercentThroughEightSeason(season,this.state.now) }}>
                        ⟵ Now ({this.getDaysLeft(season,this.state.now)} left)
                      </span>
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
    let t = date.valueOf();
    
    if (t <= end && t >= start) {
      // interpolate
      let percentage = (t - start) / (end - start);
      return Math.floor(fullSeasonHeight * percentage) + "px";
    }
    return null;
  }
  getDaysLeft(eightSeason, date) {
    //console.log(date);
    //console.log(eightSeason.dateEnd);
    if (date < eightSeason.dateEnd) {
      const msLeft = eightSeason.dateEnd - date;
      const daysLeft = msLeft/(1000*60*60*24);
      if (daysLeft > 1) {
        return daysLeft.toFixed(1) + " days";
      } else {
        const hoursLeft = msLeft/(1000*60*60);
        if (hoursLeft > 1) {
          return Math.floor(hoursLeft) + " hours";
        } else {
          const minsLeft = (hoursLeft % 1)*60;
          const secsLeft = (minsLeft % 1)*60;
          return Math.floor(minsLeft).toFixed(0).padStart(2,"0") + ":" + Math.floor(secsLeft).toFixed(0).padStart(2,"0");
        }
      }
    }
    return null;
  }
}


export default App;
