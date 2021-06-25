
import { _decorator, Component, Node, Label, CCFloat, Prefab, instantiate, CCInteger, BoxCollider2D, Color, Sprite } from 'cc';
import { BackButton } from './back_button';
import { Egg } from './egg';
import { GameOver } from './game_over';
import { Player } from './player';
const { ccclass, property } = _decorator;



@ccclass('Game')
export class Game extends Component {
    // gamestate property
    // -1 : start
    // 0 : play
    // 1 : finish gameplay
    // 2 : gameover
    private currState: number = -1;

    // time properties
    @property({type: Label})
    public timeLabel: Label|null = null;

    @property({type: CCFloat})
    public startTime: number = 90;

    currentTime = this.startTime;
    timeUp = false;
   

    // egg properties
    @property({type: Prefab})
    private eggPrefab!: Prefab;
    
    @property({type: CCFloat})
    public eggDuration: number = 0;

    @property({type: CCInteger})
    private numberOfEggs: number = 0;

    eggs: Node[] = [];


    // bot properties
    @property({type: Prefab})
    private botPrefab!: Prefab;

    @property({type: Prefab})
    private botScorePrefab!: Prefab;
    botScoreLabels: Node[] = [];

    @property({type: CCInteger})
    private numberOfBots: number = 0;

    bots: Node[] = [];
    currBotScore: number[] = [];
    

    // player property
    @property({type: Label})
    public scoreLabel: Label|null = null;

    public currPlayerScore : number = 0;

    @property({type: Player})
    public player: Player | null = null;


    // game over label
    @property({type: GameOver})
    public gameOverLabel : GameOver | null = null;

    // background property
    @property({type: Sprite})
    public gameBackGround: Sprite = new Sprite();

    @property({type: Label}) 
    public winnerLabel: Label = new Label();

    // back button label (not used but could be useful)
    @property({type: BackButton})
    public backButton: BackButton | null = null;


    
    
    

    onLoad() {
        this.currState = -1;  // starting state
        this.currentTime = this.startTime;
    }

    start () {
    }

    update (deltaTime: number) {
        this.checkState(this.currState);
    }
    


    // timer counting down to 0
    countDown() {
        this.currentTime -= 1;
        if(this.timeLabel) {
            this.timeLabel.string = '' + this.currentTime;
        }
        if (this.currentTime == 0) {
            this.timeUp = true;
        }
    }
    endGame() {
        return this.timeUp;
    }


    // generate/destroy egg
    spawnEgg() {
        for (var i = 0; i < this.numberOfEggs; ++i) {
            this.eggs[i] = instantiate(this.eggPrefab);
            this.node.addChild(this.eggs[i]);
            var eggXPos = randIntFromInterval(-625, 625); // djffer to make egg always visible
            var eggYpos = randIntFromInterval(-345, 345);
            this.eggs[i].setPosition(eggXPos, eggYpos, 0);
        }
    }
    destroyEgg() {
        for (var i = 0; i < this.numberOfEggs; ++i) {
            this.eggs[i].destroy();
        }
    }



    // generate/destroy bot
    spawnBot() {
        for (var i = 0; i < this.numberOfBots; ++i) {
            this.bots[i] = instantiate(this.botPrefab);
            this.node.addChild(this.bots[i]);

            var botXPos = randIntFromInterval(-625, 625); 
            var botYpos = randIntFromInterval(-345, 345);
            this.bots[i].setPosition(botXPos, botYpos, 0);

            // set tag to recognize which one collected the egg
            this.bots[i].getComponent(BoxCollider2D).tag = i;
            this.currBotScore[i] = 0;

        }
        // create label
        this.spawnBotScoreLabel();
    }
    destroyBot() {
        for (var i = 0; i < this.numberOfBots; ++i) {
            this.bots[i].destroy();
        }
        // reset all bots score
        this.currBotScore = [];
    }

    spawnBotScoreLabel() {
        for (var i = 0; i < this.numberOfBots; ++i) {
            this.botScoreLabels[i] = instantiate(this.botScorePrefab);
            this.node.addChild(this.botScoreLabels[i]);

            // set color to match the corresponding bot
            this.botScoreLabels[i].getComponent('cc.Label').color = this.bots[i].getComponent('cc.Sprite').color;
            
            // set positions of the labels
            if (i == 0) {
                var playerScorePos = this.scoreLabel?.node.getPosition();
                this.botScoreLabels[i].setPosition(playerScorePos?.x, playerScorePos.y - 37, 0);
            } else {
                var previousScorePos = this.botScoreLabels[i-1].getPosition();
                this.botScoreLabels[i].setPosition(previousScorePos.x, previousScorePos.y - 37, 0);
            }

            // set name of the labels
            this.botScoreLabels[i].getComponent('cc.Label').string = 'BOT' + i + '\t\t' + 0 + '\n';
        }
    }

    destroyBotScoreLabel() {
        for (var i = 0; i < this.numberOfBots; ++i) {
            this.botScoreLabels[i].destroy();
        }
        this.botScoreLabels = [];
    }

    updateScore() {
        if(this.scoreLabel) {
            this.scoreLabel.string = 'PLAYER \t\t' + this.currPlayerScore + '\n';
        }
        for(var i = 0; i < this.numberOfBots; ++i) {
            this.botScoreLabels[i].getComponent('cc.Label').string = 'BOT' + i + '\t\t\t\t' + this.currBotScore[i] + '\n';
            // this.scoreLabel.string += 'BOT' + i + '\t\t' + this.currBotScore[i] + '\n';
        }
    }

    findWinner() {
        var currHigh = this.currPlayerScore;
        this.winnerLabel.string = 'PLAYER \t\t WINS!!!'
        for (var i = 0; i < this.numberOfBots; ++i) {
            if (this.currBotScore[i] > currHigh) {
                this.winnerLabel.string = 'BOT' + i + '\t\t\t WINS!!!';
                currHigh = this.currBotScore[i];
            }
        }
    }

    // monitor all possible states of the game
    checkState(state: number) {
        switch (state) {
            // start
            case -1:
                this.init();
                break;
            // gameplay
            case 0:
                this.play();
                break;
            // end gameplay
            case 1:
                this.end();
                break;
            // pending for user decision
            case 2:
                break;
        }
    }

    init() {
        // create background
        this.gameBackGround.color = new Color(11, 30, 90);
        
        // reset time and display
        this.currentTime = this.startTime;
        if (this.timeLabel) this.timeLabel.string = '' + this.currentTime;

        this.gameOverLabel?.Hide_Window(); // hide game over node if being displayed

        //spawn player egg and bots
        this.player?.spawnPlayer();
        this.spawnEgg();
        this.spawnBot();

        // reset player score
        this.currPlayerScore = 0;

        this.timeUp = false;
        this.schedule(this.countDown, 1, this.startTime-1);

        // get to next state
        this.currState = 0;

    }

    play() {
        // display the updated score to screen
        this.updateScore();

        // move to next state if game is ended
        if(this.endGame()) {
            this.currState = 1;
        }
    }

    end() {
        this.findWinner();
        // display game over node
        this.gameOverLabel?.Show_Window();

        // stop displaying game contents
        this.player?.destroyPlayer();  // "destroy" by hiding the player from screen
        this.destroyBot();
        this.destroyEgg();

        // move to pending state
        this.currState = 2;

        // end game background
        this.gameBackGround.color = new Color(0, 0, 0);
    }

    restart() {
        // move to play state
        this.currState = -1;
        this.destroyBotScoreLabel();
    }

}

// randomize number in range (min, max)
export function randIntFromInterval(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
