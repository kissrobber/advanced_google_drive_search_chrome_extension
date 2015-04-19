/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore'),
  SearchForm2 = require('./search_form2.js');

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

  render: function() {
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
        <SearchForm2 handleSearch={this.handleSearch}/>
      </div>
    );
  }

});

module.exports = SearchForm;
