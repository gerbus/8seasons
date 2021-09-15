import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import rotatingEarth from './images/earth_night_rotate_1080.h264_10fps_.30_speed_cropped_before_minterpolate_smoothed_2_cropped.mp4'
import rotatingEarthFrame1 from './images/frame_1.jpg'
import ProximateSeasons from './components/ProximateSeasons';

class App extends Component {
  render() {
    return(
      <div classname="main">
        <div className="background">
          <video
            muted
            autoPlay
            playsinline
            loop
            poster={rotatingEarthFrame1}
            id="schedule-shifts"
            preload
            >
            <source src={rotatingEarth} type="video/mp4" />
            {/* <source src={scheduleShiftsWebm} type="video/webm" />
            <source src={scheduleShiftsOgg} type="video/ogg" /> */}
            Video unavailable
          </video>
        </div>
        <div className="container">
          <div className="mt-3">
            <h1>The Eight Season Year</h1>
            <p>There's more to the changing of seasons than you think.</p>
          </div>
          <div className="seasons">
            <ProximateSeasons />
          </div>
        </div>
      </div>
    );
  }
}




export default App;
