/** @jsx React.DOM */
var React = require('react/addons'),
  _ = require('underscore');

var SearchFormAdvanced = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var bgPage = chrome.extension.getBackgroundPage();
    return bgPage.advancedFormState;
  },
  componentDidUpdate: function(prevProps, prevState){
    if(!_.isEqual(prevState, this.state)){
      this.props.handleFormUpdate();
      var bgPage = chrome.extension.getBackgroundPage();
      bgPage.advancedFormState = this.state
    }
  },
  render: function() {
    return (
      <li>
        <div className="collapsible-header">Advanced search</div>
        <div className="collapsible-body">
          <div className="row">
            <div className="input-field col s4">
            <p>
            <input type="checkbox" id="Starred" checkedLink={this.linkState('starred')}/>
            <label htmlFor="Starred">Starred</label>
            </p>
            </div>
            <div className="input-field col s8">
              <input id="email" type="email" placeholder="Email" className="validate" valueLink={this.linkState('owner')}/>
              <label htmlFor="email">Owner</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s3">
            <input type="date" className="datepicker" valueLink={this.linkState('modifiedFrom')} />
            <label className="active" htmlFor="modifiedFrom">Modified from</label>
            </div>
            <div className="input-field col s3">
            <input type="date" className="datepicker" valueLink={this.linkState('modifiedTo')} />
            <label className="active" htmlFor="modifiedTo">to</label>
            </div>

            <div className="input-field col s3">
            <input type="date" className="datepicker" valueLink={this.linkState('lastViewdFrom')} />
            <label className="active" htmlFor="lastViewdFrom">Last viewed from</label>
            </div>
            <div className="input-field col s3">
            <input type="date" className="datepicker" valueLink={this.linkState('lastViewdTo')} />
            <label className="active" htmlFor="lastViewdTo">to</label>
            </div>
          </div>
        </div>
      </li>
    );
  }

});

module.exports = SearchFormAdvanced;
