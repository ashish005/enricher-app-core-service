(function () {
    define(['angular'], function () {
        var appName = window['name'];
        var uiGridDependencies = [];
        var app = angular.module(appName, [appName+'.popup']);
        var _rootPath = './js/';
        var _baseModulesPath = {
            templateUrl: _rootPath,
            popupBaseTemplateUrl: _rootPath + 'utilities/popups/'
        };

        var popupView = {
            view: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-view.html'},
            delete: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-delete.html'},
            edit: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-edit.html'},
            tree: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-tree.html'}
        };

        function angularHelper($controllerProvider, $provide, $compileProvider) {
            // Let's keep the older references.
            app._controller = app.controller;
            app._service = app.service;
            app._factory = app.factory;
            app._value = app.value;
            app._directive = app.directive;

            // Provider-based controller.
            app.controller = function (name, constructor) {
                $controllerProvider.register(name, constructor);
                return (this);
            };

            // Provider-based service.
            app.service = function (name, constructor) {
                $provide.service(name, constructor);
                return (this);
            };

            // Provider-based factory.
            app.factory = function (name, factory) {
                $provide.factory(name, factory);
                return (this);
            };

            // Provider-based value.
            app.value = function (name, value) {
                $provide.value(name, value);
                return (this);
            };
            // Provider-based directive.
            app.directive = function (name, factory) {
                $compileProvider.directive(name, factory);
                return (this);
            };
        }

        function httpProvider($httpProvider) {
            //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.headers.common["Accept"] = "*/*";
            //$httpProvider.interceptors.push('tokenInterceptor');
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.timeout = 600000;
        };

        function appController($scope, popupService){
            $scope.showPopup = function (type, data) {
                var _service = {
                    'add-module':{
                        serviceToCall: function(){
                            $scope.$emit('updateParams', arguments[0]);
                        },
                        success: function (resp) {
                            $scope.$broadcast('updateApiList', resp.data);
                        },
                        failure: function (resp) {
                        },
                    },
                    'params':{
                        serviceToCall: function(){
                            $scope.$emit('updateParams', arguments[0]);
                        },
                        success: function (resp) {
                        },
                        failure: function (resp) {
                        },
                    }
                };
                var types = {
                    'add-module':{
                        type: 'add-module', name: 'Module Name',
                        data:[
                            {name:'Module Name', value:'', key:'', type:'dropdownTextBox', validation:'required'}
                        ]
                    },
                    'params':{
                        type: 'add-params', name: 'Params',
                        data:[
                            { value:'', key:'', type:'keyValTextBox', validation:'required'},
                            { value:'', key:'', type:'keyValTextBox', validation:'required'}
                        ]
                    }
                };

                popupInvoker(types[type], _service[type], popupService);
            }; 
        };

        function ngPluginController($scope, $rootScope){
            $rootScope.initApp = function(){
                debugger;
                $('#yourContainer').load('/Dashboard/AddURLTest');
            }
        }
        

        function popupInvoker(popupType, serviceType, popupService){
            var _data = (function (modalInfo) {
                return {
                    model: {
                        type: modalInfo['type'],
                        name: modalInfo['name'],
                        data: modalInfo['data']
                    }
                };
            })(popupType);

            performPopup(_data, serviceType,  popupService)();
        };

        function performPopup(_model, postPopupSvc, popupService){
            var _model = _model || {model:{ type: 'type', name: 'name', data: [] }},
            operation = {
                    prePopupSvc: popupService['showPopup'],
                    template: popupView['view']['templateUrl'],
                    postPopupSvc: postPopupSvc || null
                };

            return function () {
                operation.prePopupSvc(operation.template, _model).then(function (resp) {
                    var _info = resp.model['data'];
                    var svc = operation['postPopupSvc'];
                    var svcInvoked = svc['serviceToCall'](_info);
                    if(svcInvoked) {
                        svcInvoked.then(svc['success'], svc['failure']);
                    }
                }, function (err) {
                });
            }
        }

        app
            .config(['$httpProvider', httpProvider])
            .config(angularHelper)
            
            .controller("ngPluginController", ['$scope', '$rootScope', ngPluginController])
            .controller("appController", ['$scope', 'popupService', appController])
            .run(['$rootScope', function ($rootScope) {
                $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {});
                $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {});
                $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {});
                $rootScope.$on('$viewContentLoaded', function () {});
            }]);

        angular.element(document).ready(function () {
            angular.bootstrap(document, [appName]);
        });
    });
})();