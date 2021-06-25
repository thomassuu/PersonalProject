
import { _decorator, Component, Node, Canvas, director} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneTransition')
export class SceneTransition extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    Load_Next_Scene() {
        director.loadScene("Gameplay");
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

