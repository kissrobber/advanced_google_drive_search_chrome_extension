/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore'),
  Loading = require('./loading.js'),
  SearchForm = require('./search_form.js'),
  SearchResult = require('./search_result.js'),
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

    var retrievePageOfFiles = function(request, result) {
      request.execute(function(resp) {
        result = result.concat(resp.items);
        var nextPageToken = resp.nextPageToken;
        if (nextPageToken) {
          request = gapi.client.drive.files.list({
            'pageToken': nextPageToken
          });
          retrievePageOfFiles(request, result);
        } else {
          var newState = React.addons.update(self.state, {
            results: {$set: result},
            loading: {$set: false}
          });
          self.setState(newState);
        }
      });
    }

    var query = [];
    if(form.searchWord && form.searchWord.length > 0){
      query.push('fullText contains "' + form.searchWord + '"');
    }
    if(form.starred === true){
      query.push('starred = true');
    }
    if(form.folders && form.folders.length > 0){
      var tmp = [];
      _.each(form.folders, function(folder){
        tmp.push('"' + folder.id + '" in parents');
      });
      query.push('(' + tmp.join(' or ') + ')');
    }
    if(form.owner){
      query.push('"' + form.owner + '" in owners');
    }
    if(form.modifiedFrom){
      var date = moment(form.modifiedFrom, "YYYY-MM-DD").startOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      query.push('modifiedDate >= "' + date + '"');
    }
    if(form.modifiedTo){
      var date = moment(form.modifiedTo, "YYYY-MM-DD").endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      query.push('modifiedDate <= "' + date + '"');
    }
    if(form.lastViewdFrom){
      var date = moment(form.lastViewdFrom, "YYYY-MM-DD").startOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      query.push('lastViewedByMeDate >= "' + date + '"');
    }
    if(form.lastViewdTo){
      var date = moment(form.lastViewdTo, "YYYY-MM-DD").endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      query.push('lastViewedByMeDate <= "' + date + '"');
    }

    if(query.length == 0){
      return;
    }
    var initialRequest = gapi.client.drive.files.list({
      q: query.join(' and ')
    });

    var newState = React.addons.update(self.state, {
      loading: {$set: true}
    });
    self.setState(newState);
    retrievePageOfFiles(initialRequest, []);
  },
  handleSelectFolder: function(folder){
    this.refs.form.handleSelectFolder(folder);
  },

  render: function() {
    return (
      <div>
        <SearchForm handleSearch={this.handleSearch} ref="form"/>
      { this.state.loading ? <Loading/> : <SearchResult results={this.state.results} handleSelectFolder={this.handleSelectFolder}/> }
      </div>
    );
  }

});

module.exports = Search;
