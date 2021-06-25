
import { _decorator, Component, CCFloat, Animation, BoxCollider2D, Color} from 'cc';
import { randIntFromInterval } from './game';
const { ccclass, property } = _decorator;

@ccclass('Bot')
export class Bot extends Component {
    // speed property
    @property({type: CCFloat})
    public maxSpeed: number = 0;

    private speed: number = 0;
    private currXSpeed = 0;
    private currYSpeed = 0;

    // used for animation 
    @property({type: Animation})
    public bodyAnim: Animation|null = null;
    

    // keep track of what animation is being played
    walkLeft: boolean = false;
    walkRight: boolean = false;
    walkUp: boolean = false;
    walkDown: boolean = false;
   

    onLoad() {

        this.currXSpeed = 0;
        this.currYSpeed = 0;
        // create a speed and a color for this bot
        this.speed = randIntFromInterval(this.maxSpeed/5, this.maxSpeed);
        this.generateColor();
    }

    start () {
    }

    update (deltaTime: number) {
        this.moveTowardEgg();
        // this.schedule(this.moveTowardEgg(), randIntFromInterval(0,3));
        this.playAnimation();
        // if (this.node.parent?.getComponent("Game").endGame()) {
        //     this.node.destroy();
        // }
    }

    moveTowardEgg() {
        // current position of this bot
        var currPos = this.node.getPosition();
        var eggNode = this.node.parent?.getChildByName('Egg');

        // if egg is on the screen
        if (eggNode != undefined) {
            // determine the distance between the bot and the egg
            var eggcurrPos = eggNode.getPosition();
            var distDiffX = currPos.x - eggcurrPos.x;
            var distDiffY = currPos.y - eggcurrPos.y;
        } else {
            this.currXSpeed = 0;
            this.currYSpeed = 0;
            distDiffX = 0;
            distDiffY = 0;
        }

        // going towards the egg

        // if distance from the egg is within the bot's hitbox then they're at the same place
        if (distDiffX >= -this.getComponent(BoxCollider2D)?.size.width && distDiffX <= this.getComponent(BoxCollider2D)?.size.width) {
            this.currXSpeed = 0;
        // if bot is on the left of the egg then move to the right
        } else if (distDiffX < 0) {
            this.currXSpeed = this.speed;
        // if bot is on the right of the egg then move to the left
        } else if (distDiffX > 0) {
            this.currXSpeed = -this.speed;
        }

        if (distDiffY >= -this.getComponent(BoxCollider2D)?.size.height && distDiffY <= this.getComponent(BoxCollider2D)?.size.height) {
            this.currYSpeed = 0;
        // if bot is below the egg then move up
        } else if (distDiffY < 0) {
            this.currYSpeed = this.speed;
        // if bot is above the egg then move down
        } else if (distDiffY > 0) {
            this.currYSpeed = -this.speed;
        } 

        var currPos = this.node.getPosition();
        // move towards the egg with appropriate speed
        this.node.setPosition(currPos.x + this.currXSpeed, currPos.y + this.currYSpeed, currPos.z);
    }

    playAnimation() {
        // idling or not
        if (this.bodyAnim) {
            if (this.currXSpeed == 0 && this.currYSpeed == 0) {
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

        // moving animation
        if(this.bodyAnim) {  
            if (this.currXSpeed < 0 && !this.walkLeft) {
                this.bodyAnim.play("WalkLeft");
                this.walkLeft = true;
                this.walkRight = false;
                this.walkUp = false;
                this.walkDown = false;
            } else if (this.currXSpeed > 0 && !this.walkRight) {
                this.bodyAnim.play("WalkRight");
                this.walkLeft = false;
                this.walkRight = true;
                this.walkUp = false;
                this.walkDown = false;
            } else if (this.currXSpeed == 0) {
                if (this.currYSpeed > 0 && !this.walkUp) {
                    this.bodyAnim.play("WalkBack");
                    this.walkDown = false;
                    this.walkUp = true;
                    this.walkLeft = false;
                    this.walkRight = false;
                } else if (this.currYSpeed < 0 && !this.walkDown) {
                    this.bodyAnim.play("WalkFront");
                    this.walkDown = true;
                    this.walkUp = false;
                    this.walkLeft = false;
                    this.walkRight = false;
                }
            } else if (this.currYSpeed < 0 && !this.walkDown) {
                this.bodyAnim.play("WalkFront");
                this.walkDown = true;
                this.walkUp = false;
                this.walkLeft = false;
                this.walkRight = false;
            } else if (this.currYSpeed > 0 && !this.walkUp) {
                this.bodyAnim.play("WalkBack");
                this.walkDown = false;
                this.walkUp = true;
                this.walkLeft = false;
                this.walkRight = false;
            } else if (this.currYSpeed == 0) {
                if (this.currXSpeed > 0 && !this.walkRight) {
                    this.bodyAnim.play("WalkRight");
                    this.walkRight = true;
                    this.walkLeft = false;
                    this.walkUp = false;
                    this.walkDown = false;
                } else if (this.currXSpeed < 0 && !this.walkLeft) {
                    this.bodyAnim.play("WalkLeft");
                    this.walkLeft = true;
                    this.walkRight = false;
                    this.walkUp = false;
                    this.walkDown = false;
                }
            }
        }
    }

    // generate a random color for the bot
    generateColor() {
        this.node.getComponent('cc.Sprite').color = new Color(randIntFromInterval(0,250), 0 , randIntFromInterval(0,250));
    }
}

/**
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
