import React, { Component } from "react";
import Youtube from "react-youtube";
import ClassesService from "../services/classes.service";
import EventsService from "../services/events.service";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.getClass = this.getClass.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.onPlayerPause = this.onPlayerPause.bind(this);
    this.compileEvents = this.compileEvents.bind(this);
    this.state = {
      headerText: 'Loading...',
      classData: null,
      player: null,
    };
    this.timer = null
    this.timeSpent = []
    this.percentWatched = 0
    this.sessionStartTime = null
    this.lastTimestamp = 0
  }

  componentDidMount() {
    this.getClass();
    this.sessionStartTime = Date.now();
  }

  componentWillUnmount() {
    //FIRE EVENTS HERE
    if (this.props.currentUser) {
      const events = this.compileEvents();
      EventsService.postEvents(events).then(
        () => {
          this.props.checkLogin();
          this.props.history.push("/classes");
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log('error', resMessage);
        }
      );
    }
  }

  compileEvents() { 
    const { classData } = this.state;
    const video_id = classData.id;
    const user_id = this.props.currentUser; 
    const sessionLength = Math.round((Date.now() - this.sessionStartTime)/1000);
    const sessionLengthEvent = Player.createEvent('session_length', sessionLength, user_id, video_id);
    const percentWatchedEvent = Player.createEvent('percent_watched', this.percentWatched, user_id, video_id);
    const lastTimestampEvent = Player.createEvent('last_timestamp', this.lastTimestamp, user_id, video_id);
    return [sessionLengthEvent, percentWatchedEvent, lastTimestampEvent];
  }

  static createEvent(type, value, user_id, video_id) {
    return {
      type,
      value,
      user_id,
      video_id
    }
  }

  getClass() {
    const { params: { id } } = this.props.match;
    ClassesService.getClass(id).then(
      response => {
        if (response.data) {
          this.setState({
            classData: response.data,
            headerText: 'Class Player',
          });
        } else {
          this.setState({
            headerText: 'No Class for that id. Please do not blame developer.'
          });
        }
      },
      error => {
        console.log('error', error);
        if (error.response && error.response.status === 403) {
          this.props.history.push("/login");
        } else {
          this.setState({
            headerText: 'T_T Error getting Class. Kindly blame developer.'
          });
        }
      }
    );
  }

  onPlayerReady(event){
    this.setState({
      player: event.target
    })
  }

  onPlayerStateChange(event) {
    const { player } = this.state;

    const calcPercentage = () => {
      let percent = 0;
      for(let i=0, l=this.timeSpent.length; i<l; i++){
          if(this.timeSpent[i]) percent++;
      }
      this.percentWatched = Math.round(percent / this.timeSpent.length * 100);
  }

    const record = () => {
      this.timeSpent[ parseInt(player.getCurrentTime()) ] = true;
      calcPercentage();
    }

    if(event.data === 1) { // Started playing
        if(!this.timeSpent.length){
            this.timeSpent = new Array( parseInt(player.getDuration()) );
        }
        this.timer = setInterval(record,100);
    } else {
        clearInterval(this.timer);
    }
}

onPlayerPause() {
  const { player } = this.state;
  this.lastTimestamp =  Math.round(player.getCurrentTime());
}

  render() {
    const {
      headerText,
      classData
    } = this.state;
      
    // Note: Not a robust implementation of a parser whatsover but it works for our data set.
    // TODO: replace this with Robust regex
    const extractVideoIdFromYouTubeUrl = (url) => {
      let id = url.substring(url.lastIndexOf("v=")+2,url.length);
      return id;
    }

    const opts = {
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        controls: 1,
        modestbranding: 1
      },
    };

    return (
      <div className="container">
      <header className="jumbotron">
      <h3>{headerText}</h3>
      </header>
      {!!classData && <Youtube 
        videoId={extractVideoIdFromYouTubeUrl(classData.video_url)}
        opts={opts}
        onReady={this.onPlayerReady}
        onStateChange={this.onPlayerStateChange}
        onPause={this.onPlayerPause}
      />}
      </div>
    );
  }
}
