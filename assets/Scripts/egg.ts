
import { _decorator, Component, CCInteger, Collider2D, Contact2DType, Color, Label, Animation} from 'cc';
import { Bot } from './bot';
import { Game } from './game';
import { randIntFromInterval } from './game';
const { ccclass, property } = _decorator;

@ccclass('Egg')
export class Egg extends Component {
    
    // not used but can be useful
    @property({type: CCInteger})
    public pickRadius: number | null = null;

    @property({type: Bot}) 
    public bot: Bot | null = null;
    
    gameComponent = new Component();
    
    onLoad() {
        // PhysicsSystem2D.instance.enable = true;
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        // parent node is canvas
        this.gameComponent = this.node.parent?.getComponent("Game");
        // create a random color for the egg
        this.generateColor();
    }
    start () {
        
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        // player tag is -1
        if (otherCollider.tag == -1) {
            this.gameComponent.currPlayerScore += 1;
        } else {
            this.gameComponent.currBotScore[otherCollider.tag] += 1;
        }

        // in case player pick it up at the same time as the clock hits 0
        if(this.node.active) {
            this.node.destroy();
        }
    }

    // when an egg is destroyed, spawn another one (as long as the game is still moving)
    onDestroy() {
        if (!this.gameComponent.endGame()) {
            this.gameComponent.spawnEgg();
        }
    }

    update (deltaTime: number) {
    }

    generateColor() {
        this.node.getComponent('cc.Sprite').color = new Color(randIntFromInterval(0,255), randIntFromInterval(0,255), randIntFromInterval(0,255));
    }
}
