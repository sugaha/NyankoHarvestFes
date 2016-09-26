//Title.js
var MyLayer = cc.Layer.extend({
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

                var Title = cc.Sprite.create(res.Title_png);
                Title.setPosition(size.width / 2, size.height /1.5);
                Title.setScale(0.8);
                this.addChild(Title, 0);

                var Ready = cc.Sprite.create(res.ready_png);
                Ready.setPosition(size.width / 2, size.height /8);
                Ready.setScale(0.8);
                this.addChild(Ready, 0);


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
        cc.director.runScene(new gameScene());
        if (audioEngine.isMusicPlaying()) {
          //audioEngine.stopMusic();
          audioEngine.playEffect(res.button_mp3);
        }

    },
});

var TitleScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
    }
});
