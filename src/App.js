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
      <div>
        <ul>
          <li>{this.state.currentTime}</li>
          <li>{this.state.current8season}</li>
          <li>{this.state.current8seasonStart} to {this.state.current8seasonEnd}</li>
          <li>{this.state.next8season}</li>
          <li>{this.state.currentSunrise}</li>
          <li>{this.state.currentSunset}</li>
          <li>{this.state.currentDaylightHours}</li>
        </ul>
      </div>
    );
  }
}


export default App;
