/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore'),
  Loading = require('./loading.js'),
  SearchForm = require('./search_form.js'),
  SearchResult = require('./search_result.js'),
  DriveApi = require('./drive_api.js'),
  moment = require('moment');

var Search = React.createClass({
  getInitialState: function() {
    return {
      results: [],
      loading: false
    };
  },

  handleSearch: function(form){
    var self = this;
    DriveApi.search(form,
      null,
      function(){
        var newState = React.addons.update(self.state, {
          loading: {$set: true}
        });
        self.setState(newState);
      },
      function(result){
        var newState = React.addons.update(self.state, {
          results: {$set: result},
          loading: {$set: false}
        });
        self.setState(newState);
      });
  },

  render: function() {
    return (
      <div>
        <SearchForm handleSearch={this.handleSearch} ref="form"/>
      { this.state.loading ? <Loading/> : <SearchResult results={this.state.results}/> }
      </div>
    );
  }

});

module.exports = Search;
