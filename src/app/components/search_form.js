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
    var newState = React.addons.update(this.state, {
      searchWord: {$set: null},
      folder: {$set: folder}
    });
    this.setState(newState);
  },
  handleUnselectFolder: function(){
    var newState = React.addons.update(this.state, {
      folder: {$set: null}
    });
    this.setState(newState);
  },
  handleUpFolder: function(){
    var self = this;
    var request = gapi.client.drive.files.get({
      'fileId': this.state.folder.parents[0].id
    });
    request.execute(function(resp) {
      self.handleSelectFolder(resp);
    });
  },

  render: function() {
    var selectedFolder = null;
    var parentFolder = null;
    if(this.state.folder && this.state.folder.parents && this.state.folder.parents.length > 0){
      parentFolder = this.state.folder.parents[this.state.folder.parents.length - 1];
    }
    var folderUpIcon = (<a href='#'
      className='up'
      onClick={this.handleUpFolder}>
      <img src='images/folder-up-icon.png'/>
    </a>);
    if(this.state.folder){
      selectedFolder = (
        <div className='selectedFolder'>
          <span>{this.state.folder.title}</span>
          {parentFolder ? folderUpIcon : null }
          <a href='#' className='remove'
            onClick={this.handleUnselectFolder}>
            <img src='images/folder-remove-icon.png'/>
          </a>
        </div>
      );
    }
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
        {selectedFolder}
      </div>
    );
  }

});

module.exports = SearchForm;
