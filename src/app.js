var itemsLayer;
var cat;
var xSpeed = 0; //カートの移動速度

var detectedX;　 //現在タッチしているX座標
var savedX;　 //前回タッチしていたX座標
var touching = false;　 //タッチ状況管理用flag
var cloud;

var score_1 = 0; //一桁
var score_2 = 0; //二桁
var score_3 = 0; //三桁
var score_label1;
var score_label2;
var score_label3;

var time = 60;
var timer_label;

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
  }
});

var game = cc.Layer.extend({
  init: function() {
    this._super();
    //グラデーション背景
    //  var backgroundLayer = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));
    //音楽再生エンジン
    audioEngine = cc.audioEngine;

    if (!audioEngine.isMusicPlaying()) {
      //audioEngine.playMusic("res/bgm_main.mp3", true);
      audioEngine.playMusic(res.main_mp3, true);
    }

    //森の背景
    var background = new cc.Sprite(res.background_png);
    var size = cc.director.getWinSize();
    background.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
    var backgroundLayer = cc.Layer.create();
    backgroundLayer.addChild(background);
    this.addChild(backgroundLayer);

    //スコア表示
    var score = new cc.Sprite(res.score_png);
    var size = cc.director.getWinSize();
    score.setPosition(cc.p(size.width / 1.155, size.height / 13.3));
    var scoreLayer = cc.Layer.create();
    scoreLayer.addChild(score);
    this.addChild(scoreLayer);

    score_label1 = cc.LabelTTF.create("" + score_1, "Arial",25);
    score_label1.setPosition(cc.p(size.width / 1.04, size.height / 20));
    score_label1.fillStyle = "black";
    this.addChild(score_label1);

    score_label2 = cc.LabelTTF.create("" + score_2, "Arial",25);
    score_label2.setPosition(cc.p(size.width / 1.11, size.height / 20));
    score_label2.fillStyle = "black";
    this.addChild(score_label2);

    score_label3 = cc.LabelTTF.create("" + score_3, "Arial",25);
    score_label3.setPosition(cc.p(size.width / 1.2, size.height / 20));
    score_label3.fillStyle = "black";
    this.addChild(score_label3);

    //時間表示
    var timer = new cc.Sprite(res.timer_pmg);
    timer.setPosition(cc.p(size.width / 8, size.height / 12));
    var timerLayer = cc.Layer.create();
    timerLayer.addChild(timer, 0);
    this.addChild(timerLayer);

    timer_label = cc.LabelTTF.create(time,"Arial",25);
    timer_label.setPosition(cc.p(size.width / 7, size.height / 12));
    timer_label.fillStyle = "black";
    this.addChild(timer_label);

    //アイテムがおちてくるレイヤー
    itemsLayer = cc.Layer.create();
    this.addChild(itemsLayer);

    //プレイヤーを操作するレイヤー
    topLayer = cc.Layer.create();
    this.addChild(topLayer);

    cat = cc.Sprite.create(res.cat_png);
    basket = cc.Sprite.create(res.basket1_png);
    topLayer.addChild(cat, 1);
    topLayer.addChild(basket, 0);
    cat.addChild(basket, 0);

    cat.setScale(0.8);
    cat.setPosition(240, 50);
    this.schedule(this.addItem, 1);

    basket.setScale(0.6);
    basket.setPosition(60,60);
    this.schedule(this.addItem,1);

    //タッチイベントのリスナー追加
    cc.eventManager.addListener(touchListener, this);
    //カートの移動のため　Update関数を1/60秒ごと実行させる　
    this.scheduleUpdate();
  },

  addItem: function() {
    var item = new Item();
    itemsLayer.addChild(item, 1);
  },
  removeItem: function(item) {
    itemsLayer.removeChild(item);
  },

  timecount: function(){
    time--;
    if(time < 0){
      time = 0;
      cc.director.runScene(new ClearScene());
      time = 60;
    }
    timer_label.setString("" + time);
  },

  //カートの移動のため　Update関数を1/60秒ごと実行させる関数
  update: function(dt) {
    this.schedule(this.timecount, 1);

    if (touching) {
      //現在タッチしているX座標と前回の座標の差分をとる
      var deltaX = savedX - detectedX;
      //差分でカートが右にいくか左にいくかを判断する
      if (deltaX > 0) {
        xSpeed = -2;
      }
      if (deltaX < 0) {
        xSpeed = 2;
      }
      //saveXに今回のX座標を代入し、onTouchMovedイベントで
      //detectedX変数が更新されても対応できるようにする
      savedX = detectedX;
      if (xSpeed > 0) {
        cat.setFlippedX(true);
        basket.setPosition(basket.getPosition().x/4,basket.getPosition().y);
      }
      if (xSpeed < 0) {
        cat.setFlippedX(false);
        basket.setPosition(55,64);
      }
      cat.setPosition(cat.getPosition().x + xSpeed, cat.getPosition().y);
    }
  }

});

//スクロール移動する雲
var ScrollingCl = cc.Sprite.extend({
  //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
  ctor: function() {
    this._super();
    this.initWithFile(res.cloud_png);
  },
  //onEnterメソッドはスプライト描画の際に必ず呼ばれる
  onEnter: function() {
    //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
    this.setPosition(size.width, size.height / 2);
    //  this.setPosition(480,160);
  },
  scroll: function() {
    //座標を更新する
    this.setPosition(this.getPosition().x - scrollSpeed, this.getPosition().y);
    //画面の端に到達したら反対側の座標にする
    if (this.getPosition().x < 0) {
      this.setPosition(this.getPosition().x + 480, this.getPosition().y);
    }
  }
});


var Item = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムに爆弾と果物を生成する
    if (Math.random() < 0.5) {
      this.initWithFile(res.bomb_png);
      this.isBomb = true;
    } else {
      this.initWithFile(res.apple_png);
      this.isBomb = false;
    }
  },
  //アイテムが生成された後、描画されるときに実行
  onEnter: function() {
    this._super();
    //ランダムな位置に
    this.setPosition(Math.random() * 400 + 40, 350);
    //ランダムな座標に移動させる
    var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random() * 400 + 40, -50));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //果物の処理　座標をチェックしてカートに接近したら
    if (this.getPosition().y < 35 && this.getPosition().y > 15 &&
      Math.abs(this.getPosition().x - cat.getPosition().x) < 10 && !this.isBomb) {
      gameLayer.removeItem(this);
      score_1++;
      if(score_1 > 9){
        score_2++;
        score_1 = 0;
        score_label2.setString("" + score_2);
        if(score_2 > 9){
          score_3++;
          score_2 = 0;
          score_label3.setString("" + score_3);
        }
      }
      score_label1.setString("" + score_1);
      console.log("FRUIT");
    }
    //爆弾の処理　座標をチェックしてカートの接近したら　フルーツより爆弾に当たりやすくしている
    if (this.getPosition().y < 35 && Math.abs(this.getPosition().x - cat.getPosition().x) < 25 &&
      this.isBomb) {

      gameLayer.removeItem(this);
      //cat = cc.Sprite.create(res.cat3_png);
      score_2--;

    if(score_2 < 0){
      if(score_3 >= 1){
        score_3--;
        score_2 = 9;
        score_label3.setString("" + score_3);
      }else{
          score_2 = 0;
          score_1 = 0;
          score_label1.setString("" + score_1);
        }
      }
      score_label2.setString("" + score_2);
      console.log("BOMB");

    }
    //地面に落ちたアイテムは消去
    if (this.getPosition().y < -30) {
      gameLayer.removeItem(this)
    }
  }
});

//バーチャルアナログパッド用のタッチリスナーの実装
var touchListener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan: function(touch, event) {
    touching = true;
    //現在タッチ中のX座標を保持する変数へ代入
    detectedX = touch.getLocation().x;
    //前回タッチしていたX座標として代入
    savedX = detectedX;
    return true;
  },
  onTouchMoved: function(touch, event) {
    //現在タッチ中のX座標を保持する変数へ代入
    detectedX = touch.getLocation().x;
  },
  onTouchEnded: function(touch, event) {
    //タッチflagをOFF
    touching = false;
  }
})
