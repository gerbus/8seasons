import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from 'chart.js';
import SunCalc from 'suncalc';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Meeus from '../node_modules/astronomia/lib/base.js';
import * as EightSeasons from './8seasons.js';

class App extends Component {
  constructor(props) {
    super(props);
    Chart.defaults.global.elements.point.radius = 1;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">The 8 Season Year</h1>
        </header>
        <div className="container">
          <EightSeasonYear />
        </div>
      </div>
    );
  }
}

class EightSeasonYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 356*2,
      data: {}
    };
  }
  
  getDaylightHoursData() {
    var start_date = new Date();
    start_date.setDate(start_date.getDate() - this.state.days/2);
    
    var dataset = {
      label: "",
      data: [],
      backgroundColor: "#00aaff",
      borderColor: [],
      borderWidth: 1
    };
    
    var data = {
      labels: [],
      datasets: [dataset]
    };
    
    this.getIntervalCount(start_date);
    
    for (let i = 0; i < this.state.days; i++) {
      // Set date
      let date = new Date(start_date);
      date.setDate(date.getDate() + i);
      
      // Get data
      let sunData =  SunCalc.getTimes(date,49.2827,-123.1207);
      let daylightHours = (sunData.sunset - sunData.sunrise) / (1000 * 3600);
      
      // Segment data by season
      data.labels.push(date);
      data.datasets[0].data.push(daylightHours);
    }
    
    return data;
  }
  getIntervalCount(start_date) {
    // How many intervals?
    let lastInterval = "";
    let intervalCount = 0;
    for (let i = 0; i < this.state.days; i++) {
      // Set date
      let date = new Date(start_date);
      date.setDate(date.getDate() + i);

      // Get year, season
      let interval = date.getFullYear() + EightSeasons.get8Season(date);

      // Incremet counter if new season
      if (lastInterval != interval) {
        intervalCount++;
        console.log(interval);
        lastInterval = interval;
      }
    }
    console.log(intervalCount);
  }
  componentWillMount() {
    this.setState({data: this.getDaylightHoursData()});
  }
  render() {
    console.log(EightSeasons.getSamiSeason(new Date()));
    return(
      <canvas ref="myChart" id="myChart" width="400" height="200"></canvas>
    );
  }
  componentDidMount() {
    var myChart = new Chart(this.refs["myChart"], {
      type: 'line',
      data: this.state.data
    });
  }
}

export default App;
