$(document).ready(function () {
    // first, check if current visitor is signed in
    jQuery.ajax({
      url: '/api/forge/oauth/token',
      success: function (res) {
        // yes, it is signed in...
        $('#signOut').show();
        $('#refreshHubs').show();
  
        // prepare sign out
        $('#signOut').click(function () {
          $('#hiddenFrame').on('load', function (event) {
            location.href = '/api/forge/oauth/signout';
          });
          $('#hiddenFrame').attr('src', 'https://accounts.autodesk.com/Authentication/LogOut');
          // learn more about this signout iframe at
          // https://forge.autodesk.com/blog/log-out-forge
        })
  
        // and refresh button
        $('#refreshHubs').click(function () {
          $('#userHubs').jstree(true).refresh();
        });
  
        // finally:
        prepareUserHubsTree();
        showUser();
      }
    });
  
    $('#autodeskSigninButton').click(function () {
      jQuery.ajax({
        url: '/api/forge/oauth/url',
        success: function (url) {
          location.href = url;
        }
      });
    })
  });
  
  function prepareUserHubsTree() {
    $('#userHubs').jstree({
      'core': {
        'themes': { "icons": true },
        'multiple': false,
        'data': {
          "url": '/api/forge/datamanagement',
          "dataType": "json",
          'cache': false,
          'data': function (node) {
            $('#userHubs').jstree(true).toggle_node(node);
            return { "id": node.id };
          }
        }
      },
      'types': {
        'default': {
          'icon': 'glyphicon glyphicon-question-sign'
        },
        '#': {
          'icon': 'glyphicon glyphicon-user'
        },
        'hubs': {
          'icon': 'https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/raw/master/img/a360hub.png'
        },
        'personalHub': {
          'icon': 'https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/raw/master/img/a360hub.png'
        },
        'bim360Hubs': {
          'icon': 'https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/raw/master/img/bim360hub.png'
        },
        'bim360projects': {
          'icon': 'https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/raw/master/img/bim360project.png'
        },
        'a360projects': {
          'icon': 'https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/raw/master/img/a360project.png'
        },
        'items': {
          'icon': 'glyphicon glyphicon-file'
        },
        'folders': {
          'icon': 'glyphicon glyphicon-folder-open'
        },
        'versions': {
          'icon': 'glyphicon glyphicon-time'
        },
        'unsupported': {
          'icon': 'glyphicon glyphicon-ban-circle'
        }
      },
      "plugins": ["types", "state", "sort"],
      "state": { "key": "autodeskHubs" }// key restore tree state
    }).bind("activate_node.jstree", function (evt, data) {
      if (data != null && data.node != null && data.node.type == 'versions') {
        $("#forgeViewer").empty();
        var urn = data.node.id;
        launchViewer(urn);
      }
    });
  }
  
  function showUser() {
    jQuery.ajax({
      url: '/api/forge/user/profile',
      success: function (profile) {
        var img = '<img src="' + profile.picture + '" height="30px">';
        $('#userInfo').html(img + profile.name);
      }
    });
  }