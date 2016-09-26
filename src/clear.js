//Title.js
var CLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();

        //音楽再生エンジン
        audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          //audioEngine.playMusic("res/bgm_main.mp3", true);
          audioEngine.playMusic(res.main_mp3, true);
        }

                var TitleBG =
                cc.Sprite.create(res.TitleBG_png);
                TitleBG.setPosition(size.width / 2, size.height /1.8);
                TitleBG.setScale(1);
                this.addChild(TitleBG, 0);

                var over = cc.Sprite.create(res.over_png);
                over.setPosition(size.width / 2, size.height /1.2);
                over.setScale(0.8);
                this.addChild(over, 0);

                var kago = cc.Sprite.create(res.basket1_png);
                kago.setPosition(size.width / 1.9, size.height /5);
                kago.setScale(0.6);
                this.addChild(kago, 0);

                var nyanko = cc.Sprite.create(res.cat_png);
                nyanko.setPosition(size.width / 2, size.height /6);
                nyanko.setScale(0.8);
                this.addChild(nyanko, 0);


        // タップイベントリスナーを登録する
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        return true;
    },

    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
        // 次のシーンに切り替える
        cc.director.runScene(new TitleScene());
        if (audioEngine.isMusicPlaying()) {
          //audioEngine.stopMusic();
          audioEngine.playEffect(res.button_mp3);
        }

    },
});

var ClearScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer2 = new CLayer();
        this.addChild(layer2);
    }
});
