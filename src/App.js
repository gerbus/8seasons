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
    
    var dataset = {
      label: "",
      data: [],
      backgroundColor: "#00aaff",
      pointBackgroundColor: [],
      pointRadius: [],
      borderColor: [],
      borderWidth: 1
    };
    
    var data = {
      labels: [],
      datasets: []
    };
    
    // Count number of 8seasons in timeframe, create a dataset for each
    for (let d = 0; d < this.get8SeasonCount(start_date); d++) {
      data.datasets.push(dataset);
    }
    
    // Get all data points
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
      
      // Today?
      if (i === Math.floor(this.state.days/2)) {  
        // Style Today differently
        data.datasets[0].pointBackgroundColor.push("ff0000");
        data.datasets[0].pointRadius.push(8);
      } else {
        data.datasets[0].pointBackgroundColor.push("00aaff");
        data.datasets[0].pointRadius.push(0);
      }
    }
    
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
