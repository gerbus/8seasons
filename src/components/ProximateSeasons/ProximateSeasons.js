import React, { Component } from 'react';
import moment from 'moment';
import EightSeason from './../../8seasons.js';
import Season from './components/Season';


/** The list of 8-seasons */
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
    let { now } = this.state;
    
    return (
      <table className="table table-sm mt-5">
        <tbody>
          {this.state.seasons.map((season,index) => {
            return <Season season={season} now={now} key={index} />
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
    //let previousSeasons = [];
    //let nextSeasons = [];   
    
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
}


export default ProximateSeasons;