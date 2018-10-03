import React, { Component } from 'react';
import moment from 'moment';
import EightSeason from './../../8seasons.js';
import Season from './components/Season';


/** The list of 8-seasons */
class ProximateSeasons extends Component {
  constructor(props) {
    super(props);
    
    const now = new Date();
    const seasons = this.getSeasons(9);
    
    this.state = {
      now: now,
      seasons: seasons,
      currentSeason: seasons[0]      
    };
    
    this.handleTime = this.handleTime.bind(this);
  }
  componentWillMount() {
    setInterval(this.handleTime, 1000);  // update once every second
  }
  handleTime() {
    const now = new Date();
    const currentSeason = new EightSeason(now);
    let newState = {
      now: now
    }
    
    // Check if the current season just changed
    //  (update more of state if so)
    if (currentSeason.dateStart !== this.state.currentSeason.dateStart) {
      const seasons = this.getSeasons(9, now);
      newState.seasons = seasons;
      newState.currentSeason = currentSeason;
    }
    
    this.setState(newState);
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
  getSeasons(n, date = new Date()) {
    let seasons = [];
    let currentSeason = new EightSeason(date);
    currentSeason.isCurrent = true;
    seasons.push(currentSeason);
    
    // Build upcoming seasons
    const nNext = n - 1;
    let nextSeasonDate = new Date(moment(currentSeason.dateEnd).add(2,"day").valueOf());
    for (let i = 0; i < nNext; i++) {
      let nextSeason = new EightSeason(nextSeasonDate);
      nextSeason.isCurrent = false;
      seasons.push(nextSeason);
      // Setup for next season
      nextSeasonDate = new Date(moment(nextSeason.dateEnd).add(2,"day").valueOf());
    }
    
    return seasons;
  }
}


export default ProximateSeasons;