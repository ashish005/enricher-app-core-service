/**
 * Created by wizdev on 11/21/2015.
 */
(function(define, angular){
    "use strict";
    var _mod = window['name'] + '.popup';
    var core = angular.module(_mod, ['ui.bootstrap']);

    function popupService($q, modalService, $timeout) {
        var modalDefaults = { backdrop: true, keyboard: true, modalFade: true, templateUrl: '', windowClass: 'default-popup' };
        var _model = {};
        _model.showPopup = function (template, model) {
            modalDefaults.windowClass = 'default-popup';
            modalDefaults.templateUrl = template;
            return modalService.showModal(modalDefaults, model);
        };
        return _model;
    }

    function modalService($modal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '',
            windowClass: ''
        };
        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }
            return $modal.open(tempModalDefaults).result;
        };
    }

    core
        .factory("popupService", ['$q', "modalService", '$timeout', popupService])
        .service("modalService", ["$modal", modalService])
})(window.define, window.angular);