/** @jsx React.DOM */
var React = require('react/addons'),
  DriveApi = require('./drive_api.js')
  _ = require('underscore'),
  TreeModel = require('tree-model');

var SearchFormFolder = React.createClass({
  shouldComponentUpdate: function(){
    //Because this component is managed by jQuery...
    return false;
  },

  getInitialState: function() {
    var bgPage = chrome.extension.getBackgroundPage();
    if(!bgPage.folderFormState){
      bgPage.folderFormState = {};
    }
    return bgPage.folderFormState;
  },

  componentDidMount: function(){
    var self = this;
    DriveApi.search(
      {is_folder: true},
      null,
      function(){
        var newState = React.addons.update(self.state, {
          loading: {$set: true}
        });
        self.setState(newState);
      },
      function(result){
        var newState = React.addons.update(self.state, {
          results: {$set: result},
          loading: {$set: false}
        });
        self.setState(newState);
        self.buildTree(result);
        self.renderTree();
      });
  },

  buildTree: function(result){
    result = _.object(_.pluck(result, 'id'), result);

    var tree = new TreeModel();
    result = _.mapObject(result, function(obj, id){
      return tree.parse(obj);
    });

    var root = tree.parse({});
    for (var id in result) {
      if (result.hasOwnProperty(id)) {
        var obj = result[id];
        if(obj.model.parents && obj.model.parents.length > 0 && obj.model.parents[0].id){
          var parent = result[obj.model.parents[0].id];
          if(parent){
            parent.addChild(obj);
            continue;
          }
        }
        root.addChild(obj);
      }
    }

    var to_a = function(node){
      var children = _.map(node.children, to_a);
      return {
        label: node.model.title,
        id: node.model.id,
        children: children
      }
    };
    root = to_a(root);

    var newState = React.addons.update(this.state, {
      tree: {$set: {
        root: root,
        map: result
      }},
    });
    this.setState(newState);
  },

  handleSelect: function(selecteds){
    var self = this;
    var newState = React.addons.update(self.state, {
      selecteds: {$set: selecteds},
    });
    this.setState(newState);
    this.props.handleFormUpdate();

    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.folderFormState.selecteds = selecteds;
  },

  renderTree: function(){
    var self = this;
    if(this.state.tree){
      var treeNode = $('<div/>');
      $('#folder_tree', React.findDOMNode(this)).empty().append(treeNode);
      treeNode.tree({
        data: this.state.tree.root.children,
        autoOpen: true
      });

      treeNode.bind(
        'tree.click',
        function(e) {
          e.preventDefault();
          var selected_node = e.node;
          if (treeNode.tree('isNodeSelected', selected_node)) {
            treeNode.tree('removeFromSelection', selected_node);
          }
          else {
            treeNode.tree('addToSelection', selected_node);
          }
          var nodes = treeNode.tree('getSelectedNodes');
          self.handleSelect(nodes);
        }
      );

      _.each(this.state.selecteds, function(folder){
        var node = treeNode.tree('getNodeById', folder.id);
        treeNode.tree('addToSelection', node);
      });
    }
  },

  render: function() {
    return (
      <li key='filterByFolder'>
        <div className="collapsible-header">
          filter by Folder
        </div>
        <div className="collapsible-body">
          <div id='folder_tree'>Loading...</div>
        </div>
      </li>
    );
  }

});

module.exports = SearchFormFolder;
