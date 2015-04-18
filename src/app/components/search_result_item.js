/** @jsx React.DOM */
var React = require('react/addons');

var SearchResultItem = React.createClass({
  handleSelect: function(){
    console.log('click..');
    if(this.props.result.mimeType === "application/vnd.google-apps.folder"){
      this.props.onSelectFolder(this.props.result);
    } else {

    }
  },
  handleOpen: function(){
    chrome.tabs.create({ url: this.props.result.alternateLink });
  },

  render: function() {
    var iconImage = this.props.result.iconLink;
    if(this.props.result.mimeType === "application/vnd.google-apps.folder"){
      iconImage = 'images/folder-icon.png'
    }
    return (
      <li className="collection-item">
        <div>
        <img src={iconImage} alt=""/>
        <span className="title">{this.props.result.title}</span>
        <span> / {this.props.result.ownerNames[0]} / last modified at {this.props.result.modifiedDate}</span>
        <span className="secondary-content">
          { this.props.result.labels.starred ? <i className="mdi-action-star-rate small"></i> : null }
          {
            this.props.result.mimeType === "application/vnd.google-apps.folder" ?
              <a href='#' onClick={this.handleSelect}><img src='images/folder-down-icon.png'/></a> :
              null
          }
          <a href='#' onClick={this.handleOpen}><img src='images/open-icon.png'/></a>
        </span>
        </div>
      </li>
    );
  }

});

module.exports = SearchResultItem;
