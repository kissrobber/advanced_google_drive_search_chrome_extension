var DriveApi = function() {};

DriveApi.prototype.retrievePageOfFiles = function(request, result, callback) {
  var self = this;

  request.execute(function(resp) {
    result = result.concat(resp.items);
    var nextPageToken = resp.nextPageToken;
    if (nextPageToken) {
      request = window.gapi.client.drive.files.list({
        'pageToken': nextPageToken
      });
      self.retrievePageOfFiles(request, result, callback);
    } else {
      callback(result);
    }
  });
};

DriveApi.prototype.buildQ = function(form) {
  var query = [];
  if (form.searchWord && form.searchWord.length > 0) {
    query.push('fullText contains "' + form.searchWord + '"');
  }
  if (form.starred === true) {
    query.push('starred = true');
  }
  if (form.selecteds && form.selecteds.length > 0) {
    var tmp = [];
    var pickFolderId = function(folders) {
      var ids = [];
      _.each(folders, function(folder) {
        ids.push(folder.id);
        if (folder.children && folder.children.length > 0) {
          ids = ids.concat(pickFolderId(folder.children));
        }
      });
      return ids;
    };
    var folderIds = _.uniq(pickFolderId(form.selecteds));
    _.each(folderIds, function(folderId) {
      tmp.push('"' + folderId + '" in parents');
    });
    query.push('(' + tmp.join(' or ') + ')');
  }
  if (form.owner) {
    query.push('"' + form.owner + '" in owners');
  }
  if (form.modifiedFrom) {
    var date = moment(form.modifiedFrom, "YYYY-MM-DD").startOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    query.push('modifiedDate >= "' + date + '"');
  }
  if (form.modifiedTo) {
    var date = moment(form.modifiedTo, "YYYY-MM-DD").endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    query.push('modifiedDate <= "' + date + '"');
  }
  if (form.lastViewdFrom) {
    var date = moment(form.lastViewdFrom, "YYYY-MM-DD").startOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    query.push('lastViewedByMeDate >= "' + date + '"');
  }
  if (form.lastViewdTo) {
    var date = moment(form.lastViewdTo, "YYYY-MM-DD").endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    query.push('lastViewedByMeDate <= "' + date + '"');
  }
  if (form.is_folder) {
    query.push('mimeType = "application/vnd.google-apps.folder"');
  }
  return query;
};

DriveApi.prototype.search = function(form, fields, beforeSearch, callback) {
  var self = this;

  var query = self.buildQ(form);

  if (query.length == 0) {
    return;
  }

  if (beforeSearch) {
    beforeSearch();
  }

  var params = {};
  params.q = query.join(' and ');
  if (fields) {
    params.fields = fields;
  }
  params.maxResults = 1000;
  var initialRequest = window.gapi.client.drive.files.list(params);
  self.retrievePageOfFiles(initialRequest, [], callback);
};

module.exports = new DriveApi();
