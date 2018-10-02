import React, { Component } from 'react';
import moment from 'moment';
import SunCalc from 'suncalc';
import eightSeason from './8seasons.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import ProximateSeasons from './components/ProximateSeasons';

/** The main App */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current8season: null,
      currentDaylightHours: null,
      currentSunrise: null,
      currentSunset: null
    };
  }
  componentWillMount() {
    let today = new Date();
    let sunData =  SunCalc.getTimes(today,49.2827,-123.1207);
    let daylightMilliseconds = sunData.sunset - sunData.sunrise;
    
    this.setState({
      current8season: new eightSeason(today),
      currentDaylightHours: moment.duration(daylightMilliseconds).hours() + " hours " + moment.duration(daylightMilliseconds).minutes() + " minutes",
      currentSunrise: moment(sunData.sunrise).format("HH:mm"),
      currentSunset: moment(sunData.sunset).format("HH:mm")
    })
  }
  render() {
    return(
      <div className="container">
        <div className="mt-3">
          <h1>The Eight Season Year</h1>
          <p>There's more to the changing of seasons than you think.</p>
        </div>
        <div className="seasons">
          <ProximateSeasons />
        </div>
      </div>
    );
  }
}




export default App;
