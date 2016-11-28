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
        /*********************
         * Directives
         * 
         */
            function apisInfo($rootScope, popupService, MiddleLayerService, apiReqModel){
                return {
                    restrict: 'AE',
                    replace: true,
                    scope:false,
                    transclude: true,
                    templateUrl: 'js/controls/apis-info.html',
                    link: function ($scope, $element, $attrs) {

                        $scope.apiInfo = apiReqModel.getInfoModel({});
                        $rootScope.$on('apiInfo', function(event, req) {
                            MiddleLayerService.getApisCollectionsById(req).then(function(resp){
                                $scope.apiInfo = apiReqModel.getInfoModel(resp.data);
                            }, function(error){
                                console.log(JSON.stringify(error));
                            });
                        });
                    },
                    controller: function ($scope, $element, $controller) {
                        $element.on('click', '#params', function(e) {
                            e.stopPropagation();
                            var type = this.getAttribute('ide-key');
                            var _service = {
                                'params':{
                                    serviceToCall: function(){
                                        $scope.apiInfo.params = [];
                                        arguments[0].every(function (item, index) {
                                            var _item = {};
                                            _item[item.key] = item.value;
                                            $scope.apiInfo.params.push(_item);
                                        });
                                    },
                                    success: function (resp) {
                                    },
                                    failure: function (resp) {
                                    },
                                }
                            };
                            var types = {
                                'params':{
                                    type: 'add-params',
                                    name: 'Params',
                                    data: [{ value:'', key: '', type:'keyValTextBox'}]
                                }
                            };

                            var _paramsData = ($scope.apiInfo.params && $scope.apiInfo.params.length>0)?$scope.apiInfo.params:[] ;

                            _paramsData.every(function(item){
                                var _k = Object.keys(item)[0];
                                types[type]['data'].push({ value:item[_k], key: _k, type:'keyValTextBox'});
                            });

                            performPopup((function (modalInfo) {
                                return {
                                    model: {
                                        type: modalInfo['type'],
                                        name: modalInfo['name'],
                                        data: modalInfo['data']
                                    }
                                };
                            })(types[type]), _service[type],  popupService)();
                        });

                        $element.on('click', '#saveApi', function(e) {
                            e.stopPropagation();
                            debugger;
                            console.log(apiReqModel.get());
                            alert('hi');
                        });
                    }
                };
            }

            function apisList($rootScope, MiddleLayerService){
                return {
                    restrict: 'AE',
                    scope:{},
                    templateUrl:'js/controls/apis-list.html',
                    link: function($scope, $element, $attr, $ctrl) {
                        $element.on('click', '#invokeApi', function(e) {
                            e.stopPropagation();
                            var _key = this.getAttribute('key');
                            $rootScope.$broadcast('apiInfo', {id:_key});
                        });
                    },
                    controller: function ($scope, $element, $controller) {
                        MiddleLayerService.getApisCollections().then(function(resp){
                            $scope.data = resp;
                        }, function(error){
                            console.log(JSON.stringify(error));
                        });
                        $scope.$on('updateApiList', function (e, data) {
                            $scope.data.unshift({
                                id :data.id,
                                method:data.method,
                                name:data.name
                            });
                        });
                    }
                };
            }

            function codeEditor($compile, apiReqModel) {
                return {
                    restrict: 'AE',
                    replace: true,
                    scope: {
                        type:"@?",
                        data: '=?',
                        mode:'@?'
                    },
                    templateUrl:'js/controls/code-area.html',
                    controller: function ($scope, $element) {
                        var editor = null;
                        $element.find('#codeOptions').on('click', 'li', function (e) {
                            e.preventDefault();
                            var type = this.getAttribute('ide-key');
                            if('undo' === type){
                                editor.undo();
                            }else if('redo' === type){
                                editor.redo();
                            } else if('debug' === type){

                            }
                        });
                        //$scope.data = 'function foo(items) { var x = "All this is syntax highlighted";return x;}';
                        require([ace], function(){
                            editor = ace.edit('editor');
                            var textarea = $('textarea[name="editor"]');
                            editor.setTheme("ace/theme/monokai");
                            editor.getSession().setMode("ace/mode/"+$scope.mode);

                            if($scope.data) {
                                editor.getSession().setValue($scope.data);
                            }
                            editor.getSession().on("change", function () {
                                var _val = editor.getSession().getValue();
                                textarea.val(_val);
                                $scope.data = _val;
                                apiReqModel.update($scope.type, _val);
                            });
                            /*setTimeout(function() {
                                editor.setValue("And now how can I reset the\nundo stack,so pressing\nCTRL+Z (or Command + Z) will *NOT*\ngo back to previous value?", -1);
                                editor.getSession().setUndoManager(new ace.UndoManager())
                            }, 60000);*/
                        });
                    }
                };
            };
        /*************** */
        function ngPluginController($scope, $rootScope){
            $rootScope.initApp = function(){
                debugger;
                $('#yourContainer').load('/Dashboard/AddURLTest');
            }
        }

        function MiddleLayerService($q, $http, RequestResponseParser) {
                var projectService = {
                    getApisCollectionsById: function (req) {
                        var deferred = $q.defer();
                        $http({method: 'GET', url: '/middlelayer/apis/'+req.id}).then(function (resp) {
                            deferred.resolve(resp.data);
                        },function (error) {
                            deferred.reject(error);
                        });
                        return deferred.promise;
                    },
                    getApisCollections: function () {
                        var deferred = $q.defer();
                        $http({method: 'GET', url: '/middlelayer/apis'}).then(function (resp) {
                            deferred.resolve(resp.data);
                        },function (error) {
                            deferred.reject(error);
                        });
                        return deferred.promise;
                    },
                    createApi: function (data) {
                        var reqData = RequestResponseParser.parseRequest('createApi', data);
                        var deferred = $q.defer();
                        $http({method: 'post', url: '/middlelayer/apis', data: JSON.stringify(reqData)})
                            .then(function (resp) {
                                deferred.resolve(resp.data);
                            },function (error) {
                                deferred.reject(error);
                            });
                        return deferred.promise;
                    }
                };
                projectService.nodes = {
                    add: function (data) {
                        var _httpRequest = {method: 'POST', url: '/core/collection/item', data: data};
                        return $http(_httpRequest);
                    },
                    update: function (item) {
                        var _httpRequest = {method: 'PUT', url: '/core/collection/item', params: item};
                        return $http(_httpRequest);
                    },
                    delete: function (item) {
                        var _httpRequest = {method: 'DELETE', url: '/core/collection/item', params: item};
                        return $http(_httpRequest);
                    }
                }

                return projectService;
            }

            function RequestResponseParser() {
                var fac = {};
                fac.parseRequest = function(key, data){
                    var _info = data[0];
                    return {
                        method:_info['method'],
                        apiName:_info['value'],
                        params: null
                    };
                };
                fac.parserResponse  = function(){};

                return fac;
            }

            function apiReqModel(){
                var _model = {
                    id : null,
                    method:'Get',
                    name : '',
                };
                function infoModel(model) {
                    this.id = model.id || null;
                    this.method = model.method || 'Get';
                    this.name = model.name || '';
                    this.params = model.params || [];
                    this.authrization = model.authrization || null;
                    this.headers = model.headers || [{key:'', val:''}];
                    this.params = model.params || [{key:'', val:''}];
                    this.body = model.body || [{key:'', val:''}];
                    this.prereqscript = model.prereqscript || 'function () {}';
                    this.simulation = model.simulation  || JSON.stringify({});
                }
                var info = {};
                info.update = function (key, data) {
                    this[key] = data;
                };
                info.get = function () {
                    return this;
                };
                info.getInfoModel = function (model) {
                    return infoModel(model);
                };
                return info;
            };
        

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
            .directive('apisInfo',['$rootScope', 'popupService', 'middleLayerService', 'apiReqModel', apisInfo])
            .directive('apisList', ['$rootScope', 'middleLayerService', apisList])
            .directive('codeEditor', ['$compile', 'apiReqModel', codeEditor])
            .service('middleLayerService', ['$q', '$http', 'requestResponseParser', MiddleLayerService])
            .factory('apiReqModel',  apiReqModel)
            .factory('requestResponseParser', ['$http', RequestResponseParser])
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