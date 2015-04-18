/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore'),
  SearchFormAdvanced = require('./search_form_advanced.js');

var SearchForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var bgPage = chrome.extension.getBackgroundPage();
    return bgPage.formState;
  },

  componentWillMount: function(){
    this.handleSearch = _.debounce(this.handleSearch, 50);
  },
  componentDidUpdate: function(prevProps, prevState){
    if(!_.isEqual(prevState, this.state)){
      this.handleSearch();
      var bgPage = chrome.extension.getBackgroundPage();
      bgPage.formState = this.state
    }
  },

  handleSearch: function(advanced){
    form = _.extend(this.state, advanced);
    this.props.handleSearch(form);
  },
  handleSelectFolder: function(folder){
    if(!_.find(this.state.folders, function(f){ return f.id == folder.id; })){
      var newState = React.addons.update(this.state, {
        searchWord: { $set: null },
        folders: { $push: [folder] }
      });
      this.setState(newState);
    }
  },
  handleUnselectFolder: function(folder){
    var folders = _.reject(this.state.folders, function(f){ return f.id == folder.id; });
    var newState = React.addons.update(this.state, {
      folders: { $set: folders }
    });
    this.setState(newState);
  },
  handleUpFolder: function(folder){
    var self = this;
    var request = gapi.client.drive.files.get({
      'fileId': folder.parents[0].id
    });
    request.execute(function(resp) {
      self.handleSelectFolder(resp);
    });
  },

  buildFolders: function(){
    var self = this;
    var selectedFolders = [];
    if(self.state.folders && self.state.folders.length > 0){
      _.each(self.state.folders, function(folder){
        var folderUpIcon = (<a href='#'
          className='up'
          onClick={self.handleUpFolder.bind(self, folder)}>
          <img src='images/folder-up-icon.png'/>
          </a>);
        var parentFolder = null;
        if(folder && folder.parents && folder.parents.length > 0){
          parentFolder = folder.parents[folder.parents.length - 1];
        }
        selectedFolders.push(
          <div className='selectedFolder'>
            <span>{folder.title}</span>
            {parentFolder ? folderUpIcon : null }
            <a href='#' className='remove'
            onClick={self.handleUnselectFolder.bind(self, folder)}>
            <img src='images/folder-remove-icon.png'/>
            </a>
          </div>
        );
      });
    }
    return selectedFolders;
  },

  render: function() {
    var folders = this.buildFolders();
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <div className="input-field">
              <input id="searchWord" type="search" valueLink={this.linkState('searchWord')}/>
              <label htmlFor="searchWord"><i className="mdi-action-search"></i></label>
              <i className="mdi-navigation-close"></i>
            </div>
          </div>
        </nav>
        <SearchFormAdvanced handleSearch={this.handleSearch}/>
        {folders}
        <div className='clearfix'/>
      </div>
    );
  }

});

module.exports = SearchForm;
