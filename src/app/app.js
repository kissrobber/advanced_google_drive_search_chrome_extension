/** @jsx React.DOM */
(function () {
  var React = require('react/addons'),
    injectTapEventPlugin = require("react-tap-event-plugin"),
    Main = require('./components/main.js');
  window.React = React;
  injectTapEventPlugin();
  React.render(<Main />, document.body);
})();
