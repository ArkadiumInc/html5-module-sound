/**
 * Created by JIocb on 2/4/2016.
 */
var PhaserPatch = function ()
{
    "use strict";
};

// ========== Prototype =========
PhaserPatch.prototype = Object.create(Object.prototype);
PhaserPatch.prototype.constructor = PhaserPatch;
module.exports = PhaserPatch;

PhaserPatch.prototype.patch = function()
{
    Phaser.PIXI.Sprite.prototype.getBounds = function (matrix) {
        var width = this.texture.frame.width;
        var height = this.texture.frame.height;

        var w0 = width * (1 - this.anchor.x);
        var w1 = width * -this.anchor.x;

        var h0 = height * (1 - this.anchor.y);
        var h1 = height * -this.anchor.y;

        var worldTransform = matrix || this.worldTransform;

        var a = worldTransform.a;
        var b = worldTransform.b;
        var c = worldTransform.c;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;

        var maxX = -Infinity;
        var maxY = -Infinity;

        var minX = Infinity;
        var minY = Infinity;

        if (b === 0 && c === 0) {
            // scale may be negative!
            //if (a < 0) a *= -1;
            //if (d < 0) d *= -1;
            var temp;

            if (a < 0) {
                a *= -1;
                temp = w0;
                w0 = -w1;
                w1 = -temp;
            }
            if (d < 0) {
                d *= -1;
                temp = h0;
                h0 = -h1;
                h1 = -temp;
            }
            // this means there is no rotation going on right? RIGHT?
            // if thats the case then we can avoid checking the bound values! yay
            minX = a * w1 + tx;
            maxX = a * w0 + tx;
            minY = d * h1 + ty;
            maxY = d * h0 + ty;
        }
        else {
            var x1 = a * w1 + c * h1 + tx;
            var y1 = d * h1 + b * w1 + ty;

            var x2 = a * w0 + c * h1 + tx;
            var y2 = d * h1 + b * w0 + ty;

            var x3 = a * w0 + c * h0 + tx;
            var y3 = d * h0 + b * w0 + ty;

            var x4 = a * w1 + c * h0 + tx;
            var y4 = d * h0 + b * w1 + ty;

            minX = x1 < minX ? x1 : minX;
            minX = x2 < minX ? x2 : minX;
            minX = x3 < minX ? x3 : minX;
            minX = x4 < minX ? x4 : minX;

            minY = y1 < minY ? y1 : minY;
            minY = y2 < minY ? y2 : minY;
            minY = y3 < minY ? y3 : minY;
            minY = y4 < minY ? y4 : minY;

            maxX = x1 > maxX ? x1 : maxX;
            maxX = x2 > maxX ? x2 : maxX;
            maxX = x3 > maxX ? x3 : maxX;
            maxX = x4 > maxX ? x4 : maxX;

            maxY = y1 > maxY ? y1 : maxY;
            maxY = y2 > maxY ? y2 : maxY;
            maxY = y3 > maxY ? y3 : maxY;
            maxY = y4 > maxY ? y4 : maxY;
        }

        var bounds = this._bounds;

        bounds.x = minX;
        bounds.width = maxX - minX;

        bounds.y = minY;
        bounds.height = maxY - minY;

        // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
        this._currentBounds = bounds;

        return bounds;
    };


    /**
     * The core preUpdate - as called by World.
     * @method Phaser.Group#preUpdate
     * @protected
     */
    Phaser.Group.prototype.preUpdate = function () {

        if (this.pendingDestroy)
        {
            this.destroy();
            return false;
        }

        if (!this.exists || !this.parent.exists)
        {
            this.renderOrderID = -1;
            return false;
        }

        var i = this.children.length;

        while (i--)
        {
            if(this.children[i])
            {
                this.children[i].preUpdate();
            }
            else
            {
                console.log("PHASER PATCH ERROR :: null child in group")
            }
        }

        return true;

    };

    PIXI.DisplayObject.prototype.__defineGetter__("scaleX", function(){
        return this.scale.x;
    });

    PIXI.DisplayObject.prototype.__defineSetter__("scaleX", function(val){
        this.scale.x = val;
    });

    PIXI.DisplayObject.prototype.__defineGetter__("scaleY", function(){
        return this.scale.y;
    });

    PIXI.DisplayObject.prototype.__defineSetter__("scaleY", function(val){
        this.scale.y = val;
    });

    Phaser.BitmapText.prototype.setBoundsSize = function(width,height)
    {
        var sc = Math.min(width/this.width,height/this.height);
        var pivotX = this.pivot.x/this.width;
        var pivotY = this.pivot.y/this.height;

        if(sc<1) {
            while ((this.textWidth > width || this.textHeight > height || this.width > width || this.height > height) && this.fontSize>10) {
                this.fontSize -= 1
            }
        }

        this.pivot.x = pivotX*this.width;
        this.pivot.y = pivotY*this.height;
    }

};