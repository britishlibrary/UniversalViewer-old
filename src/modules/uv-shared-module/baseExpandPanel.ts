/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseExtension = require("./baseExtension");
import shell = require("./shell");
import utils = require("../../utils");
import baseView = require("./baseView");

export class BaseExpandPanel extends baseView.BaseView {

    isExpanded: boolean = false;
    isFullyExpanded: boolean = false;
    isUnopened: boolean = true;
    autoToggled: boolean = false;

    $top: JQuery;
    $title: JQuery;
    $collapseButton: JQuery;
    $main: JQuery;
    $closed: JQuery;
    $expandButton: JQuery;
    $expandFullButton: JQuery;
    $closedTitle: JQuery;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        
        this.setConfig('shared');
        
        super.create();

        this.$top = $('<div class="top"></div>');
        this.$element.append(this.$top);

        this.$title = $('<div class="title"></div>');
        this.$top.append(this.$title);

        this.$expandFullButton = $('<a class="expandFullButton"></a>');
        this.$top.append(this.$expandFullButton);

        this.$collapseButton = $('<div class="collapseButton"></div>');
        this.$top.append(this.$collapseButton);

        this.$closed = $('<div class="closed"></div>');
        this.$element.append(this.$closed);

        this.$expandButton = $('<a class="expandButton"></a>');
        this.$closed.append(this.$expandButton);

        this.$closedTitle = $('<a class="title"></a>');
        this.$closed.append(this.$closedTitle);

        this.$main = $('<div class="main"></div>');
        this.$element.append(this.$main);

        this.$expandButton.onPressed(() => {
            this.toggle();
        });

        this.$expandFullButton.onPressed(() => {
            this.expandFull();
        });

        this.$closedTitle.onPressed(() => {
            this.toggle();
        });

        this.$title.onPressed(() => {
            if (this.isFullyExpanded){
                this.collapseFull();
            } else {
                this.toggle();
            }
        });

        this.$collapseButton.onPressed(() => {
            if (this.isFullyExpanded){
                this.collapseFull();
            } else {
                this.toggle();
            }
        });

        this.$top.hide();
        this.$main.hide();
    }

    init(): void{
        super.init();
    }

    toggle(autoToggled?: boolean): void {

        (autoToggled) ? this.autoToggled = true : this.autoToggled = false;

        // if collapsing, hide contents immediately.
        if (this.isExpanded) {
            this.$top.hide();
            this.$main.hide();
            this.$closed.show();
        }

        var targetWidth = this.getTargetWidth();
        var targetLeft = this.getTargetLeft();

        /*
        if (immediate) {
            this.$element.width(targetWidth);
            this.$element.css('left', targetLeft);
            this.toggled();
            return;
        }
        */

        this.$element.stop().animate(
            {
                width: targetWidth,
                left: targetLeft
            },
            this.options.panelAnimationDuration, () => {
                this.toggled();
            });
    }

    toggled(): void {
        this.toggleStart();

        this.isExpanded = !this.isExpanded;

        // if expanded show content when animation finished.
        if (this.isExpanded) {
            this.$closed.hide();
            this.$top.show();
            this.$main.show();
        }
        
        this.toggleFinish();

        this.isUnopened = false;
    }

    expandFull(): void {
        var targetWidth = this.getFullTargetWidth();
        var targetLeft = this.getFullTargetLeft();

        this.expandFullStart();

        this.$element.stop().animate(
            {
                width: targetWidth,
                left: targetLeft
            },
            this.options.panelAnimationDuration, () => {
                this.expandFullFinish();
            });
    }

    collapseFull(): void {
        var targetWidth = this.getTargetWidth();
        var targetLeft = this.getTargetLeft();

        this.collapseFullStart();

        this.$element.stop().animate(
            {
                width: targetWidth,
                left: targetLeft
            },
            this.options.panelAnimationDuration, () => {
                this.collapseFullFinish();
            });
    }

    getTargetWidth(): number{
        return 0;
    }

    getTargetLeft(): number {
        return 0;
    }

    getFullTargetWidth(): number{
        return 0;
    }

    getFullTargetLeft(): number{
        return 0;
    }

    toggleStart(): void {

    }

    toggleFinish(): void {
        if (this.isExpanded && !this.autoToggled){
            this.focusCollapseButton();
        } else {
            this.focusExpandButton();
        }
    }

    expandFullStart(): void {

    }

    expandFullFinish(): void {
        this.isFullyExpanded = true;
        this.$expandFullButton.hide();

        this.focusCollapseButton();
    }

    collapseFullStart(): void {

    }

    collapseFullFinish(): void {
        this.isFullyExpanded = false;
        this.$expandFullButton.show();

        this.focusExpandFullButton();
    }

    focusExpandButton(): void {
        setTimeout(() => {
            this.$expandButton.focus();
        }, 1);
    }

    focusExpandFullButton(): void {
        setTimeout(() => {
            this.$expandFullButton.focus();
        }, 1);
    }

    focusCollapseButton(): void {
        setTimeout(() => {
            this.$collapseButton.focus();
        }, 1);
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.parent().height() - this.$top.outerHeight(true));
    }
}