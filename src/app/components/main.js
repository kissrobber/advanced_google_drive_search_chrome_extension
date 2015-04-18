/** @jsx React.DOM */
var React = require('react/addons'),
  Loading = require('./loading.js'),
  Auth = require('./auth.js'),
  Search = require('./search.js');

var Main = React.createClass({
  componentDidMount: function(){
    var self = this;
    var loadDriveApi = function(){
      if(window.gapi && window.gapi.client){
        window.gapi.client.load('drive', 'v2', function() {
          self.setState({inited: true});
        });
      } else {
        setTimeout(loadDriveApi, 50);
      }
    }
    loadDriveApi();
  },
  getInitialState: function() {
    return {
      inited: false,
      authed: false
    };
  },
  onAuthChange: function(bool){
    this.setState({authed: bool});
  },
  render: function() {
    return (
      <div>
        { this.state.inited ? (this.state.authed ? <Search/> : <Auth onAuthChange={this.onAuthChange}/>) : <Loading/> }
      </div>
    );
  }

});


module.exports = Main;
