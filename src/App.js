import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from 'chart.js';
import SunCalc from 'suncalc';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Meeus from '../node_modules/astronomia/lib/base.js';
import * as EightSeasons from './8seasons.js';

const pallette = {
  winter1: "#8888ff",
  winter2: "#8888cc",
  spring1: "#88ff88",
  spring2: "#ccff88",
  summer1: "#ffffcc",
  summer2: "#ffff88",
  autumn1: "#ff4400",
  autumn2: "#ff8800"
};

class App extends Component {
  constructor(props) {
    super(props);
    Chart.defaults.global.elements.point.radius = 0;
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
      days: 365*2,
      data: {}
    };
  }
  
  getDaylightHoursData() {
    var start_date = new Date();
    start_date.setDate(start_date.getDate() - Math.floor(this.state.days/2));
    
    var data = {
      labels: [],
      datasets: []
    };
    
    // Initialize 8Season
    let active8Season = EightSeasons.get8Season(start_date);
    let lastInterval = start_date.getFullYear() + " - " + active8Season;
    let activeIntervalIndex = 0; 
    
    // Count number of 8seasons in timeframe (create a dataset for each)
    var n8Seasons = this.get8SeasonCount(start_date);
    console.log(n8Seasons);
    for (var i = 0; i < n8Seasons; i++) {
      data.datasets.push(new Object());
      data.datasets[i].label = lastInterval;
      data.datasets[i].data = [];
      data.datasets[i].backgroundColor = pallette[active8Season.replace(" ","").toLowerCase()];
      data.datasets[i].pointBackgroundColor = [];
      data.datasets[i].pointRadius = [];
    }
   
    // Iterate through all data points in range
    for (let i = 0; i < this.state.days; i++) {
      
      // Get sunlight data for each date
      let date = new Date(start_date);
      date.setDate(date.getDate() + i);
      data.labels.push(date);
      let sunData =  SunCalc.getTimes(date,49.2827,-123.1207);
      let daylightHours = (sunData.sunset - sunData.sunrise) / (1000 * 3600);
      
      // Set active 8season
      active8Season = EightSeasons.get8Season(date);
      let activeInterval = date.getFullYear() + " - " + active8Season;
      if (lastInterval != activeInterval) {
        // Push new 8Season
        activeIntervalIndex++;
        data.datasets[activeIntervalIndex].label = activeInterval;
        data.datasets[activeIntervalIndex].backgroundColor = pallette[active8Season.replace(" ","").toLowerCase()];
        lastInterval = activeInterval;
      }
      
      // Push data point to active dataset, null to other datasets
      for (let s = 0; s < n8Seasons; s++) {
        if (s == activeIntervalIndex) {
          data.datasets[activeIntervalIndex].data.push(daylightHours);
          // Today?
          if (i === Math.floor(this.state.days/2)) {  
            // Style Today differently
            data.datasets[activeIntervalIndex].pointBackgroundColor.push("#ff0000");
            data.datasets[activeIntervalIndex].pointRadius.push(8);
          } else {
            data.datasets[activeIntervalIndex].pointBackgroundColor.push("#000000");
            data.datasets[activeIntervalIndex].pointRadius.push(0);
          }
        } else {
          // Other datasets get null
          data.datasets[s].data.push(null);
          data.datasets[s].pointBackgroundColor.push("#000000");
          data.datasets[s].pointRadius.push(0);
        }
      }
    }
    console.log(data);
    return data;
  }
  get8SeasonCount(start_date) {
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
        //console.log(interval);
        lastInterval = interval;
      }
    }
    return intervalCount;
  }
  get8SeasonIndex(date) {
    
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
      data: this.state.data,
      options: {
        scales: {
            yAxes: [{}]
        }
      }
    });
  }
  componentDidUpdate() {
    //myChart.datasets[0].points[this.today_index].fillColor = "#ff0000"; 
  }
}

export default App;
