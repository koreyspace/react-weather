import React, { Component } from 'react';
import './App.css';

import { connect } from 'react-redux';

import Plot from './Plot.js';

import {
  changeLocation,
  setSelectedDate,
  setSelectedTemp,
  fetchData 
} from './actions';

class App extends Component {

fetchData = (evt) => { 
   evt.preventDefault();

  var location = encodeURIComponent(this.props.redux.get('location'));
  
  var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
  var urlSuffix = '&APPID=292a94468ec7e070aa1f0a998b683ebc&units=imperial';
  var url = urlPrefix + location + urlSuffix;
  
  this.props.dispatch(fetchData(url));
  
};
 

 onPlotClick = (data) => {
  if (data.points) {
   this.props.dispatch(setSelectedDate(data.points[0].x));
   this.props.dispatch(setSelectedTemp(data.points[0].y));
  }
 };
 
 changeLocation = (evt) => {
  this.props.dispatch(changeLocation(evt.target.value));
 };
 

  render() {
    var currentTemp = 'not loaded yet';
    
    if (this.props.redux.getIn(['data', 'list'])) {
      currentTemp = this.props.redux.getIn(['data', 'list', '0', 'main', 'temp']);

    }
    
    return (
      <div>
      <h1>Weather</h1>
      <form onSubmit={this.fetchData}>
        <label> I want weather for
          <input placeholder={"City, Country"} 
          type="text" 
          value={this.props.redux.get('location')}
          onChange={this.changeLocation}
          
          /> 
        
        </label>
      
      </form>
      {/*
          Render the current temperature and the forecast if we have data
          otherwise return null
        */}
      {(this.props.redux.getIn(['data', 'list'])) ? (
      <div className="wrapper">
        {/* Render the current temperature if no specific date is selected */}
        <p className="temp-wrapper">
             <span className="temp">
              { this.props.redux.getIn(['selected', 'temp']) ? this.props.redux.getIn(['selected', 'temp']) : currentTemp }
             </span>
            <span className="temp-symbol">°F</span>
            <span className="temp-date">
              { this.props.redux.getIn(['selected', 'temp']) ? this.props.redux.getIn(['selected', 'date']) : ''}
            </span> 
          </p> 
          
      <h2>Forecast</h2>
      <Plot 
        xData={this.props.redux.get('dates')}
        yData={this.props.redux.get('temps')}
        onPlotClick={this.onPlotClick}
        type="scatter"
        />
        
      </div>
      ) : null}
      
      </div> 
    );
  }
}

function mapStateToProps(state) {
  return {
    redux: state
    
  };
  
}


export default connect(mapStateToProps)(App);
