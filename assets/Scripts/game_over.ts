
import { _decorator, Component, Node, tween, Vec3, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
    Show_Window() {
        this.node.active = true;
    }

    Hide_Window() {
        this.node.active = false;
    }
}

