/// <reference path="../../js/jquery.d.ts" />
import baseExtension = require("./baseExtension");
import baseView = require("./baseView");
import utils = require("../../utils");
import help = require("../uv-dialogues-module/helpDialogue");
import settings = require("../uv-dialogues-module/settingsDialogue");

export class HeaderPanel extends baseView.BaseView {

    $options: JQuery;
    $centerOptions: JQuery;
    $rightOptions: JQuery;
    $helpButton: JQuery;
    $settingsButton: JQuery;
    $messageBox: JQuery;

    message: string;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('headerPanel');

        super.create();

        $.subscribe(baseExtension.BaseExtension.SHOW_MESSAGE, (e, message) => {
            this.showMessage(message);
        });

        $.subscribe(baseExtension.BaseExtension.HIDE_MESSAGE, () => {
            this.hideMessage();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$centerOptions = $('<div class="centerOptions"></div>');
        this.$options.append(this.$centerOptions);

        this.$rightOptions = $('<div class="rightOptions"></div>');
        this.$options.append(this.$rightOptions);

        //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
        //this.$rightOptions.append(this.$helpButton);

        this.$settingsButton = $('<a class="imageBtn settings" tabindex="3"></a>');
        this.$settingsButton.attr('title', this.content.settings);
        this.$rightOptions.append(this.$settingsButton);

        this.$messageBox = $('<div class="messageBox"> \
                                <div class="text"></div> \
                                <div class="close"></div> \
                              </div>');

        this.$element.append(this.$messageBox);

        this.$messageBox.hide();
        this.$messageBox.find('.close').attr('title', this.content.close);
        this.$messageBox.find('.close').on('click', (e) => {
            e.preventDefault();
            this.hideMessage();            
        });

        this.$settingsButton.onPressed(() => {
            $.publish(settings.SettingsDialogue.SHOW_SETTINGS_DIALOGUE);
        });
    }

    showMessage(message: string): void {
        this.message = message;
        this.$messageBox.find('.text').html(message).find('a').attr('target', '_top');
        this.$messageBox.show();
        this.$element.addClass('showMessage');
        this.extension.resize();
    }

    hideMessage(): void {
        this.$element.removeClass('showMessage');
        this.$messageBox.hide();
        this.extension.resize();
    }

    resize(): void {
        super.resize();

        var headerWidth = this.$element.width();
        var center = headerWidth / 2;
        var containerWidth = this.$centerOptions.outerWidth();
        var pos = center - (containerWidth / 2);

        this.$centerOptions.css({
            left: pos
        });

        if (this.$messageBox.is(':visible')){
            var $text = this.$messageBox.find('.text');
            //$text.actualWidth(this.$element.width() - this.$messageBox.find('.close').outerWidth(true));
            $text.width(this.$element.width() - this.$messageBox.find('.close').outerWidth(true));
            $text.ellipsisFill(this.message);
        }
    }
}