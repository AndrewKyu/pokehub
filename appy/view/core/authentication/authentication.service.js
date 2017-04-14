angular.module('core.authentication')
.service('Auth', [
  '$http',
  '$window',
  '$timeout',
  function Auth($http, $window, $timeout) {

    var age = 10;

    this.saveToken = function (token){
      $window.localStorage['token'] = token;
    };

    this.getToken = function () {
      return $window.localStorage['token'];
    };

    this.getId = function () {
      return $window.localStorage['_id'];
    };
      
    this.getFirstName = function () {
      return $window.localStorage['firstName'];
    };
      
    this.getLastName = function () {
      return $window.localStorage['lastName'];
    };

    this.getFiles = function() {
      var names = JSON.parse($window.localStorage.getItem('files'));
      return names;
    }

    this.setAge = function(age) {
      age = age;
    }

    this.getAge = function() {
      return age;
    }

    this.getData = function() {
      return data;
    }

    var data = { 
      lastUpdated: [], 
    };

    this.updateTimer = function() {
      var userId = this.getId();
      headers: {
          authorization: $window.localStorage['token']
        }

      return $http.get('/user/' + userId + '/file')
        .then(function(result) {
          data.lastUpdated = [];
          for (i = 0; i < result.data.docs.length; i++) {
            data.lastUpdated.push(result.data.docs[i]['name']);

          }

          console.log(data.lastUpdated)
        })
    };

    
/*
    var currentUser = function() {
      if(isLoggedIn()){
        var session = getSession();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };
*/
    this.register = function(user) {
      return $http.post('/register', user)
        .then(function successCallback(response) {
            return response;
          }, function errorCallback(response) {
            return response;
          }
        );
    };

    this.login = function(user) {
      return $http.post('/login', user)
        .then(function successCallback(response) {
          if(response.data['refreshToken']){
            $window.localStorage['token'] = response.data['refreshToken'];
            $window.localStorage['_id'] = response.data.user['_id'];
            $window.localStorage['firstName'] = response.data.user['firstName'];
            $window.localStorage['lastName'] = response.data.user['lastName'];
            var data = [];
            for (i = 0; i < response.data.user.files.length; i++) {
              data[i] = response.data.user.files[i];
            }
            $window.localStorage.setItem('files', JSON.stringify(data));
            $http.defaults.headers.common.Authorization = response.data['refreshToken'];
          }
          return response;
        }, function errorCallback(response) {
          return response;
        });
    };

    this.logout = function() {
      var config = {
        url: '/logout',
        method: 'DELETE',
        headers: {
          authorization: $window.localStorage['token']
        }
      };

      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('_id');
      $http.defaults.headers.common.Authorization = null;
      return $http(config)
        .then(function successCallback(response) {
          return response;
        }, function errorCallback(response) {
          return response;
        }
      );
    };

    this.addFileToScope = function(file, filepath) {
      
    };
  

  this.createFile = function(file, filepath) {

      var userId = this.getId();
      var params = {
        name: file.name,
        type: file.type,
        path: filepath
      }
      return $http.post('/file', params)
        .then(function(result) {
          var fileId = result.data._id;
          var params = [fileId];
          return $http.post('/user/' + userId + '/file', params)
        })
    };

      this.createFolder = function(folder, folderpath) { //come up with parameters

      var userId = this.getId();
      var params = {
        name: folder.name,
        path: folderpath,
        parent: folder.parent 
      }
      return $http.post('/folder', params)
        .then(function(result) {
          console.log(result);
          var folderId = result.data._id;
          var params = [folderId];
          return $http.post('/user/' + userId + '/folder', params)
        })
    };



 }
]);
