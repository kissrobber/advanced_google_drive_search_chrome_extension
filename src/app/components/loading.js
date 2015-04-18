/** @jsx React.DOM */
var React = require('react/addons');

var Loading = React.createClass({
  render: function() {
    return (
      <div>

      <div className="row">
      <div className="input-field col s5">
      </div>

      <div className="input-field col s2">

      <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-blue">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>

      <div className="spinner-layer spinner-red">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>

      <div className="spinner-layer spinner-yellow">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>

      <div className="spinner-layer spinner-green">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>
      </div>

      </div>

      <div className="input-field col s5">
      </div>
      </div>

      </div>
    );
  }
});

module.exports = Loading;
