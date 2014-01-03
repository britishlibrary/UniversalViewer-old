/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import utils = require("../../utils");
import IMediaElementProvider = require("./iMediaElementProvider");

export class Provider extends baseProvider.BaseProvider implements IMediaElementProvider{

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            mediaUriTemplate: "{0}{1}",
            timestampUris: true
        }, config.options);
    }

    getEmbedScript(width: number, height: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var script = String.prototype.format(template, this.dataUri, this.assetSequenceIndex, width, height, esu);

        return script;
    }

    getMediaUri(asset: any): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, asset.fileUri);

        return uri;
    }

    getPosterImageUri(): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, this.assetSequence.extensions.posterImage);

        return uri;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + utils.Utils.getTimeStamp();
    }
}
