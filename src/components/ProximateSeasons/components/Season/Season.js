import React, { Component } from 'react';
import moment from 'moment';


class Season extends Component {
  render() {
    let {season, now} = this.props;
    
    return (
      <tr
        className={season.isCurrent ? "current " + season.name.fourByTwo.replace(/ /g,'') : season.name.fourByTwo.replace(/ /g,'')}
        >
        <td 
          className="name"
          >
          <span>{season.name.fourByTwo}</span>
          <span className="year">{this.getYearSpan(season)}</span>
        </td>
        <td className="date">
          <span className="start">{moment(season.dateStart).format("YYYY-MMM-DD HH:mm zz")}</span>
        </td>
        {season.isCurrent ? (
          <td className="today">
              <span 
                className="now"
                style={{marginTop: this.getPercentThroughEightSeason(season,now) }}>
                ⟵ Now ({this.getDaysLeft(season,now)} left)
              </span>
          </td>                    
        ) : null}
      </tr>
    );
  }
  getDaysLeft(eightSeason, date) {
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
  getYearSpan(season) {
    if (season.yearStart === season.yearEnd) {
      return season.yearStart;
    } else {
      return season.yearStart + '/' + season.yearEnd;
    }
  }
}


export default Season;