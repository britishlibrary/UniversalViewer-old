/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/uv-shared-module/baseProvider");
import utils = require("../../utils");
import ISeadragonProvider = require("./iSeadragonProvider");

export class Provider extends baseProvider.BaseProvider implements ISeadragonProvider{

    constructor(config: any, manifest: any) {
        super(config, manifest);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            dziUriTemplate: "{0}{1}"
        }, config.options);
    }

    getImageUri(asset: any, dziBaseUri?: string, dziUriTemplate?: string): string{
        var baseUri = dziBaseUri ? dziBaseUri : this.options.dziBaseUri || this.options.dataBaseUri || "";
        var template = dziUriTemplate? dziUriTemplate : this.options.dziUriTemplate;
        var uri = String.prototype.format(template, baseUri, asset.dziUri);

        return uri;
    }

    getEmbedScript(assetIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var configUri = this.config.uri || '';

        var script = String.prototype.format(template, this.dataUri, this.sequenceIndex, assetIndex, zoom, rotation, configUri, width, height, esu);

        return script;
    }

    // currently only applicable to IIIF
    getTileSources(): any[] {

        return null;
    }
}
