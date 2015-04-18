/** @jsx React.DOM */
var React = require('react/addons'),
  Loading = require('./loading.js');

var Auth = React.createClass({
  getInitialState: function() {
    return {
      loading: true
    };
  },
  componentDidMount: function(){
    this.authorize();
  },

  handleAuth: function(b){
    this.setState({
      loading: false
    });
    this.props.onAuthChange(b);
  },
  authorize: function(){
    var self = this;
    // "https://www.googleapis.com/auth/drive",
    // "https://www.googleapis.com/auth/drive.file",
    // "https://www.googleapis.com/auth/drive.appdata",
    // "https://www.googleapis.com/auth/drive.apps.readonly"
    gapi.auth.authorize({
      client_id: "540816257433-satoregj0ihovaee1mge48hg69aaag90.apps.googleusercontent.com",
      scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.metadata.readonly"
      ],
      immediate: true
    }, function(token) {
      if (token.error) {
        self.handleAuth(false);
      } else {
        self.handleAuth(true);
      }
    });
  },

  handleClick: function() {
    var self = this;
    self.setState({
      loading: true
    });
    chrome.identity.getAuthToken({
      'interactive': true
    }, function(token) {
      if (token) {
        setTimeout(function(){
          self.authorize();
        }, 10);
      } else {
        self.handleAuth(false);
      }
    });
  },
  render: function() {
    if(this.state.loading){
      return <Loading/>
    } else {
      return (
        <div className="row">
        <div className="input-field col s8 offset-s4">
        <a className="waves-effect waves-light btn-large" onClick={this.handleClick}>
        <i className="mdi-action-settings-power left"></i>
        Authorize with Google Account
        </a>
        </div>
        </div>
      );
    }
  }
});

module.exports = Auth;
