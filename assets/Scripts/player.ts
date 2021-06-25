
import { _decorator, Component, Node, systemEvent, SystemEventType, EventKeyboard, macro, CCFloat, Animation, absMax,} from 'cc';
import { MINIGAME } from 'cc/env';
const { ccclass, property } = _decorator;
import { randIntFromInterval } from './game';

@ccclass('Player')
export class Player extends Component {
    
    // desired speed can be changed in cocos creator
    @property({type: CCFloat})
    public speed: number = 0;

    @property({type: Animation})
    public bodyAnim: Animation|null = null;

    xSpeed: number = 0;
    ySpeed: number = 0;

    acc: boolean = false;

    accLeft: boolean = false;
    accRight: boolean = false;
    accUp: boolean = false;
    accDown: boolean = false;

    // used to check what animation is being played
    walkLeft: boolean = false;
    walkRight: boolean = false;
    walkUp: boolean = false;
    walkDown: boolean = false;
    
    onLoad() {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);

        // reset everything since not moving
        this.acc = false;
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;

        this.walkLeft = false;
        this.walkRight = false;
        this.walkUp = false;
        this.walkDown = false;

        this.xSpeed = 0;
        this.ySpeed = 0;

    }
    // handle when wasd is pressed
    onKeyDown (event: EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.a:
                this.acc = true;
                this.accLeft = true;
                break;
            case macro.KEY.d:
                this.acc = true;
                this.accRight = true;
                break;
            case macro.KEY.w:
                this.acc = true;
                this.accUp = true;
                break;
            case macro.KEY.s:
                this.acc = true;
                this.accDown = true;
                break;
        }
    }

    // handle when wasd is released
    onKeyUp (event: EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.a:
                this.acc = false;
                this.accLeft = false;
                this.xSpeed = 0;
                break;

            case macro.KEY.d:
                this.acc = false;
                this.accRight = false;
                this.xSpeed = 0;
                break;

            case macro.KEY.w:
                this.acc = false;
                this.accUp = false;
                this.ySpeed = 0;
                break;

            case macro.KEY.s:
                this.acc = false;
                this.accDown = false;
                this.ySpeed = 0;
                break;
        }
    }

    update (deltaTime: number) {
        // moving left
        if (this.accLeft) {
            this.xSpeed = -this.speed;
            if(this.bodyAnim) {  
                if (!this.walkLeft) {
                    this.acc = true;
                    this.bodyAnim.play("WalkLeft");
                    this.walkLeft = true;
                }
            }
        }

        // moving right
        if (this.accRight) {
            this.xSpeed = this.speed;
            if(this.bodyAnim) {  
                if (!this.walkRight) {
                    this.acc = true;
                    this.bodyAnim.play("WalkRight");
                    this.walkRight = true;
                }
            }
        }

        // moving up
        if (this.accUp) {
            this.ySpeed = this.speed;
            if(this.bodyAnim) {  
                if (!this.walkUp) {
                    this.acc = true;
                    this.bodyAnim.play("WalkBack");
                    this.walkUp = true;
                }
            }
        }

        // moving down
        if (this.accDown) {
            this.ySpeed = -this.speed;
            if(this.bodyAnim) {  
                if (!this.walkDown) {
                    this.acc = true;
                    this.bodyAnim.play("WalkFront");
                    this.walkDown = true;
                }
            }
        }

        // check to perform idle animation
        if(this.bodyAnim) {
            if(!this.acc) {
                if(this.walkLeft) {
                    this.bodyAnim.play("IdleLeft");
                    this.walkLeft = false;
                } 
                if (this.walkRight) {
                    this.bodyAnim.play("IdleRight");
                    this.walkRight = false;
                } 
                if (this.walkUp) {
                    this.bodyAnim.play("IdleBack");
                    this.walkUp = false;
                }
                if(this.walkDown) {
                    this.bodyAnim.play("IdleFront");
                    this.walkDown = false;
                }
            }
        }
                    
        // use if it's accelerating motion
        // if (Math.abs(this.xSpeed*deltaTime) > this.speed) this.xSpeed = this.speed * this.xSpeed*deltaTime/Math.abs(this.xSpeed);
        // if (Math.abs(this.ySpeed*deltaTime) > this.speed) this.ySpeed = this.speed * this.ySpeed*deltaTime/Math.abs(this.ySpeed)
        
        const currPos = this.node.getPosition();
        var playerPosX = currPos.x + this.xSpeed;
        var playerPosY = currPos.y + this.ySpeed;
        if (playerPosX >= 630) playerPosX = 630;
        if (playerPosX <= -630) playerPosX = -630;
        if (playerPosY >= 350) playerPosY = 350;
        if (playerPosY <= -350) playerPosY = -350;
        this.node.setPosition(playerPosX, playerPosY, currPos.z);
    }

    // create effect as if player is actually spawned in a different position
    spawnPlayer() {
        this.node.active = true;
        var XPos = randIntFromInterval(-625, 625);
        var Ypos = randIntFromInterval(-345, 345);
        this.node.setPosition(XPos, Ypos, 0);
    }

    // make it looks like it's destroyed but in face just hiding it
    destroyPlayer() {
        this.node.active = false;
    }
}


