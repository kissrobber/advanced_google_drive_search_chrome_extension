/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore'),
  SearchFormAdvanced = require('./search_form_advanced.js'),
  SearchFormFolder = require('./search_form_folder.js');

var SearchForm2 = React.createClass({
  componentDidMount: function(){
    var self = this;
    _.defer(function(){
      $(React.findDOMNode(self)).collapsible();
      self.handleSearch();
    });
  },

  handleSearch: function(){
    var form = _.extend({}, this.refs.advanced.state, _.pick(this.refs.folder.state, 'selecteds'));
    this.props.handleSearch(form);
  },

  render: function() {
    return (
      <ul key='collapsible' className="collapsible popout" data-collapsible="expandable">
        <SearchFormAdvanced ref='advanced' handleFormUpdate={this.handleSearch} />
        <SearchFormFolder ref='folder' handleFormUpdate={this.handleSearch} />
      </ul>
    );
  }

});

module.exports = SearchForm2;
