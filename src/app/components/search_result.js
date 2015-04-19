/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore'),
  SearchFormItem = require('./search_result_item');

var SearchResult = React.createClass({
  render: function() {
    var self = this;
    var results = _.map(this.props.results, function(result){
      return (
        <SearchFormItem
          key={result.id}
          result={result}
        />
      );
    });
    return (
      <ul className="collection fileList">
        {results}
      </ul>
    );
  }

});

module.exports = SearchResult;
