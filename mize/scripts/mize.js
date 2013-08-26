"use strict";

/** Const */
var SCREEN_WIDTH = 680
  , SCREEN_HEIGHT = 960
  , SCREEN_CENTER_X = SCREEN_WIDTH/2
  , SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var ASSETS = {
    "player": "resource/img/ch003.png"
};

/** bootstrap */
tm.main(function() {
  var app = tm.app.CanvasApp("#game");
  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  app.fitWindow();
  app.background = "hsl(0, 0%, 0%)";

  app.replaceScene(tm.app.LoadingScene({
      assets: ASSETS
    , nextScene: GameScene
  }));

  app.run();
});

/** Game */
tm.define("GameScene", {
    superClass: "tm.app.Scene"
  , init: function() {
      this.superInit();

      var player = Player();
      this.palyer = player;
      player.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
      this.addChild(player);
    }
});

/** Character */
var DOWN_DEFAULT = 1
  , UP_DEFAULT = 5
  , LEFT_DEFAULT = 9
  , RIGHT_DEFAULT = 13;

var ANGLE_DOWN = 270
  , ANGLE_UP = 90
  , ANGLE_LEFT = 180
  , ANGLE_RIGHT = 0;

tm.define("Character", {
    superClass: tm.app.AnimationSprite
  , init: function(asset, frame, scale) {
      frame = frame || {
        width: 32
      , height: 32
      , count: 16
      };

      scale = scale || 4;

      var ss = tm.app.SpriteSheet({
          image: asset
        , frame: frame
        , animations: {
            "down": {
                frames: [0, 1, 2, 3]
              , next: "down"
              , frequency: 4
            }
          , "up": {
                frames: [4, 5, 6, 7]
              , next: "up"
              , frequency: 4
          }
          , "left": {
                frames: [8, 9, 10, 11]
              , next: "left"
              , frequency: 4
          }
          , "right": {
                frames: [12, 13, 14, 15]
              , next: "right"
              , frequency: 4
          }
        }
      });

      this.superInit(ss, frame.width*scale, frame.height*scale);
    }
  , velocity: tm.geom.Vector2(0, 0)
  , angleToDirect: function(angle) {
      var direct = '';
      if (angle > ANGLE_DOWN-45 && angle <= ANGLE_DOWN+45) {
        direct = 'down';
      } else if (angle > ANGLE_UP-45 && angle <= ANGLE_UP+45) {
        direct = 'up';
      } else if (angle > ANGLE_LEFT-45 && angle <= ANGLE_LEFT+45) {
        direct = 'left';
      } else if (angle > ANGLE_DOWN+45 || angle <= ANGLE_RIGHT+45) {
        direct = 'right';
      }

      return direct;
    }
  , movingAction: function(app) {
      var angle = app.keyboard.getKeyAngle();
      if (angle != null) {
        this.velocity.setDegree(angle, 1);
        this.velocity.y *= -1;
        this.gotoAndPlay(this.angleToDirect(angle));
        this.angle = angle;
      }
    }

});

/** Player */
tm.define("Player", {
    superClass: Character
  , init: function() {
      this.name = "player";
      this.superInit(this.name);
    }
  , update: function(app) {
      this.movingAction(app);
    }
});