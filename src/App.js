import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from 'chart.js';
import SunCalc from 'suncalc';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">The 8 Season Year</h1>
        </header>
        <EightSeasonYear />
      </div>
    );
  }
}

class EightSeasonYear extends Component {
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  getData() {
    var start_date = new Date();
    start_date.setDate(start_date.getDate() - 182);

    var data = {
      labels: [],
      datasets: [{
        label: "label",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    };

    for (let i = 0; i < 365; i++) {
      let date = new Date(start_date);
      date.setDate(date.getDate() + i);
      let sunData =  SunCalc.getTimes(date,49.2827,-123.1207);
      let daylightHours = (sunData.sunset - sunData.sunrise) / (1000 * 3600);
      
      data.labels.push(date);
      data.datasets[0].data.push(daylightHours);
    }
    
    return data;
  }
  componentWillMount() {
    this.setState({data: this.getData()});
  }
  render() {
    return(
      <canvas ref="myChart" id="myChart" width="400" height="400"></canvas>
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
