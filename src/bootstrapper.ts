/// <reference path="js/jquery.d.ts" />
import utils = require("utils");

class BootStrapper{

    manifest: any;
    extensions: any;
    dataBaseUri: string;
    manifestUri: string;
    sequenceIndex: number;
    sequences: any;
    sequence: any;
    IIIF: boolean = true;
    configExtensionUri: string;
    configExtension: any;
    jsonp: boolean;

    // this loads the manifest, determines what kind of extension and provider to use, and instantiates them.
    constructor(extensions: any) {

        this.extensions = extensions;

        var that = this;

        that.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');
        that.manifestUri = utils.Utils.getQuerystringParameter('du');
        that.configExtensionUri = utils.Utils.getQuerystringParameter('c');
        that.jsonp = utils.Utils.getBool(utils.Utils.getQuerystringParameter('jsonp'), false);

        if (that.dataBaseUri){
            that.manifestUri = that.dataBaseUri + that.manifestUri;
        }

        jQuery.support.cors = true;

        // if data-config has been set on embedding div, load the js
        if (that.configExtensionUri){

            // if "sessionstorage"
            if (that.configExtensionUri.toLowerCase() === "sessionstorage"){
                var config = sessionStorage.getItem("uv-config");
                that.configExtension = JSON.parse(config);
                that.loadManifest();
            } else {
                $.getJSON(that.configExtensionUri, (configExtension) => {
                    that.configExtension = configExtension;
                    that.loadManifest();
                });
            }
        } else {
            that.loadManifest();
        }
    }

    corsEnabled(): boolean {
        return Modernizr.cors && !this.jsonp
    }

    loadManifest(): void{
        var that = this;

        if (this.corsEnabled()){
            $.getJSON(that.manifestUri, (manifest) => {
                that.parseManifest(manifest);
            });
        } else {
            // use jsonp
            var settings: JQueryAjaxSettings = <JQueryAjaxSettings>{
                url: that.manifestUri,
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'manifestCallback'
            };

            $.ajax(settings);

            window.manifestCallback = (manifest: any) => {
                that.parseManifest(manifest);
            };
        }
    }

    parseManifest(manifest: any): void {
        this.manifest = manifest;

        // if on home domain, check hash params. otherwise, use
        // embed data attributes or default to 0.
        var isHomeDomain = utils.Utils.getQuerystringParameter('hd') === "true";
        var isReload = utils.Utils.getQuerystringParameter('rl') === "true";
        var sequenceParam = 'si';

        if (this.configExtension && this.configExtension.options && this.configExtension.options.IIIF) {
            this.IIIF = this.configExtension.options.IIIF;
        }

        if (!this.IIIF) sequenceParam = 'asi';

        if (isHomeDomain && !isReload) {
            this.sequenceIndex = parseInt(utils.Utils.getHashParameter(sequenceParam, parent.document));
        }

        if (!this.sequenceIndex) {
            this.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(sequenceParam)) || 0;
        }

        if (!this.IIIF) {
            this.sequences = this.manifest.assetSequences;
        } else {
            this.sequences = this.manifest.sequences;
        }

        if (!this.sequences) {
            this.notFound();
        }

        this.loadSequence();
    }

    loadSequence(): void{

        var that = this;

        if (!that.IIIF){
            // if it's not a reference, load dependencies
            if (!that.sequences[that.sequenceIndex].$ref) {
                that.sequence = that.sequences[that.sequenceIndex];
                that.loadDependencies();
            } else {
                // load referenced sequence.
                var baseManifestUri = that.manifestUri.substr(0, that.manifestUri.lastIndexOf('/') + 1);
                var sequenceUri = baseManifestUri + that.sequences[that.sequenceIndex].$ref;

                $.getJSON(sequenceUri, (sequenceData) => {
                    that.sequence = that.sequences[that.sequenceIndex] = sequenceData;
                    that.loadDependencies();
                });
            }
        } else {
            // if it's not a reference, load dependencies
            if (that.sequences[that.sequenceIndex].canvases) {
                that.sequence = that.sequences[that.sequenceIndex];
                that.loadDependencies();
            } else {
                // load referenced sequence.
                var sequenceUri = String(that.sequences[that.sequenceIndex]['@id']);

                $.getJSON(sequenceUri, (sequenceData) => {
                    that.sequence = that.sequences[that.sequenceIndex] = sequenceData;
                    that.loadDependencies();
                });
            }
        }
    }

    notFound(): void{
        try{
            parent.$(parent.document).trigger("onNotFound");
            return;
        } catch (e) {}
    }

    loadDependencies(): void {

        var that = this;
        var extension;

        if (!that.IIIF){
            extension = that.extensions[that.sequence.assetType];
        } else {
            // only seadragon extension is compatible with IIIF
            extension = that.extensions['seadragon/iiif'];
        }

        // todo: use a compiler flag when available
        var configPath = (window.DEBUG)? 'extensions/' + extension.name + '/config.js' : 'js/' + extension.name + '-config.js';

        // feature detection
        yepnope({
            test: window.btoa && window.atob,
            nope: 'js/base64.min.js',
            complete: function () {
                $.getJSON(configPath, (config) => {

                    // if data-config has been set on embedding div, extend the existing config object.
                    if (that.configExtension){
                        // save a reference to the config extension uri.
                        config.uri = that.configExtensionUri;

                        $.extend(true, config, that.configExtension);
                    }

                    // todo: use a compiler flag when available
                    var cssPath = (window.DEBUG)? 'extensions/' + extension.name + '/css/styles.css' : 'themes/' + config.options.theme + '/css/' + extension.name + '.css';

                    yepnope.injectCss(cssPath, function () {
                        that.createExtension(extension, config);
                    });
                });
            }
        });
    }

    createExtension(extension: any, config: any): void{
        // create provider.
        var provider = new extension.provider(config, this.manifest);

        // create extension.
        new extension.type(provider);
    }
}

export = BootStrapper;