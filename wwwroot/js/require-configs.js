/**
 * Created by wizdev on 10/22/2015.
 */
window['name'] = 'goLive';

var _basePath = {
    libs:'../lib/',
    app:'~/js/'
};

require.config({
    urlArgs: 'v=1.0',
    waitSeconds: 200,
    paths: {
        app: 'base',
        jQuery:  _basePath.libs+'jquery/dist/jquery',
        'jQuery-ui':  _basePath.libs+'jquery-ui/jquery-ui.min',
        angular: _basePath.libs+"angular/angular",
        bootstrap: _basePath.libs+'bootstrap/dist/js/bootstrap',
        'ui-bootstrap': _basePath.libs+'angular/ui-bootstrap-tpls-0.12.0.min',

        'util-popup': 'utilities/popup.util',
        'ace':_basePath.libs+'ace/build/src/ace'
    },
    shim: {
        angular: {exports: "angular"},
        angular: {exports: "angular", deps: ["jQuery-ui"]},
        bootstrap:{deps:['jQuery']},
        'jQuery-ui':{deps: ['jQuery']},
        'util-popup':{deps: ['ui-bootstrap']},
        'ui-bootstrap':{deps: ['jQuery', 'angular', 'bootstrap']},
        app:{
            deps: [ 'util-popup', 'ace']
        }
    },
    // kick start application
    deps: ['app']
});