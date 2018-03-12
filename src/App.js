import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import SunCalc from 'suncalc';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as EightSeasons from './8seasons.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: '',
      current8season: '',
      current8seasonStart: '',
      current8seasonEnd: '',
      currentDaylightHours: '',
      currentSunrise: '',
      currentSunset: '',
      next8season: ''
    };
    this.handleTime = this.handleTime.bind(this);
  }
  componentWillMount() {
    let today = new Date();
    let eightSeasonData = EightSeasons.get8SeasonInfo(today);
    let sunData =  SunCalc.getTimes(today,49.2827,-123.1207);
    let daylightMilliseconds = sunData.sunset - sunData.sunrise;
    
    this.setState({
      currentTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
      current8season: eightSeasonData.seasonName,
      current8seasonStart: moment(eightSeasonData.seasonStart).format("YYYY-MM-DD HH:mm"),
      current8seasonEnd: moment(eightSeasonData.seasonEnd).format("YYYY-MM-DD HH:mm"),
      next8season: eightSeasonData.nextSeasonName,
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

    let currentSeason = EightSeasons.get8SeasonInfo(new Date());
    let previousSeasonDate = new Date(moment(currentSeason.seasonStart).subtract(2,"day").valueOf());
    let nextSeasonDate = new Date(moment(currentSeason.seasonEnd).add(2,"day").valueOf());
    let previousSeason = EightSeasons.get8SeasonInfo(previousSeasonDate);
    let nextSeason = EightSeasons.get8SeasonInfo(nextSeasonDate);    
    
    console.log(previousSeason);
    console.log(nextSeason);
    
    this.state = {
      currentSeason: currentSeason,
      previousSeason: previousSeason,
      nextSeason: nextSeason
    };
  }
  render() {
    return (
      <table><tbody>
        <tr>
          <td></td>
          <td>{this.state.previousSeason.seasonName.name} {this.getYearSpan(this.state.previousSeason)}</td>
        </tr>
        <tr className="current">
          <td>You are here >></td>
          <td>{this.state.currentSeason.seasonName.name} {this.getYearSpan(this.state.currentSeason)}</td>
        </tr>
        <tr>
          <td></td>
          <td>{this.state.nextSeason.seasonName.name} {this.getYearSpan(this.state.nextSeason)}</td>
        </tr>
      </tbody></table>
    )
  }
  getYearSpan(season) {
    if (season.seasonStartYear === season.seasonEndYear) {
      return season.seasonStartYear;
    } else {
      return season.seasonStartYear + '/' + season.seasonEndYear;
    }
  }
}


export default App;
