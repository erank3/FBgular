'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1');

angular.module('myApp.services').service('FBService', function () {

    var _cachedFeed = [],
        _cachedUserData,
        _loginRequestPending = false; //flag to avoid opening several login popup windows

    var login = function (success, error) {

        if (_loginRequestPending)
            return;

        _loginRequestPending = true;

        FB.login(function (response) {

            _loginRequestPending = false;
            if (response.authResponse) {
                if (response.status === "connected") {
                    getUserData(success, error);
                }
                else if (response.status === 'not_authorized') {
                    error('User has not authenticated app.');
                } else {
                    error('User cancelled login or did not fully authorize.');
                }
            } else {
                error('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'read_stream'});

    }

    var getUserData = function (success, error) {

        FB.api('/me', function (meResponse) {
            _cachedUserData = meResponse;
            success(meResponse);
        });

    }

    return {
        getLoggedUser: function (success, error) {

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    getUserData(success, error);
                } else if (response.status === 'not_authorized') {
                    error('User has not authenticated app.');
                } else {
                    login(success, error);
                }
            });


        },

        getUserFeed: function (success, error) {
            this.getLoggedUser(function (userObject) {

                FB.api('/' + userObject.id + '/home', function (response) {

                    if (!response || response.error)
                        error(response);
                    else {
                        _cachedFeed = response.data;
                        success(response.data);
                    }
                });

            }, error);
        },

        getCachedFeed: function () {
            return _cachedFeed;
        },

        getCachedUserData: function () {
            return _cachedUserData;
        },

        extractPostStory: function (fbPost) {


            var displayValue = fbPost.message;

            if (angular.isDefined(displayValue))
                return displayValue;

            displayValue = fbPost.caption ? fbPost.caption : fbPost.story;

            if (angular.isDefined(displayValue))
                return displayValue;

            return ""; //temp solution for posts that doesn't have user story...
        }
    };
});


angular.module('myApp.services').service('ErrorMessageService', function () {

    return {
        showError: function (error) {
            if (angular.isDefined(error.error)) {
                alert(error.error.message);
            }
            else {
                alert(error);
            }
        }
    };
});