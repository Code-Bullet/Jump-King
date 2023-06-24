class AIAction {
    constructor(isJump, holdTime, xDirection) {
        this.isJump = isJump;
        this.holdTime = holdTime;//number between 0 and 1
        this.xDirection = xDirection;

    }

    clone() {
        return new AIAction(this.isJump, this.holdTime, this.xDirection);
    }

    mutate() {
        this.holdTime += random(-0.3,0.3);
        this.holdTime = constrain(this.holdTime,0.1,1);
    }
}


// let jumpChance = 0; //the chance that a random action is a jump
let jumpChance = 0.5; //the chance that a random action is a jump
let chanceOfFullJump = 0.2;
// let chanceOfFullJump = 0.2;

class Brain {

    constructor(size, randomiseInstructions = true) {
        this.instructions = [];
        this.currentInstructionNumber = 0;
        if (randomiseInstructions)
            this.randomize(size);
        this.parentReachedBestLevelAtActionNo = 0;
    }

    randomize(size) {
        for (let i = 0; i < size; i++) {
            this.instructions[i] = this.getRandomAction();
        }
    }

    getRandomAction() {
        let isJump = false;

        if (random() > jumpChance) {
            isJump = true;
        }

        let holdTime = random(0.1, 1);
        if(random()<chanceOfFullJump){
            holdTime = 1;
        }


        let directions = [-1, -1, -1, 0, 1, 1, 1]
        let xDirection = random(directions)


        return new AIAction(isJump, holdTime, xDirection)
    }

    getNextAction() {
        if(this.currentInstructionNumber >= this.instructions.length){
            return null;
        }
        this.currentInstructionNumber += 1;
        return this.instructions[this.currentInstructionNumber - 1];
    }


    clone() {
        let clone = new Brain(this.size, false);
        clone.instructions = [];
        for (let i = 0; i < this.instructions.length; i++) {
            clone.instructions.push(this.instructions[i].clone())
        }
        return clone;
    }

    mutate() {
        let mutationRate = 0.1;
        let chanceOfNewInstruction = 0.02;
        for (let i = this.parentReachedBestLevelAtActionNo; i < this.instructions.length; i++) {
            if (random() < chanceOfNewInstruction) {
                this.instructions[i] = this.getRandomAction()
            } else if (random() < mutationRate) {
                this.instructions[i].mutate();
            }
        }
    }

    mutateActionNumber(actionNumber){
        // let mutationRate = 0.1;

        actionNumber -=1; // this is done because im a bad programmer
        let chanceOfNewInstruction = 0.2;
        if (random() < chanceOfNewInstruction) {
            this.instructions[actionNumber] = this.getRandomAction()
        } else{
            this.instructions[actionNumber].mutate();
        }
    }

    increaseMoves(increaseMovesBy){
        for(var i = 0 ; i< increaseMovesBy ;i++){
            this.instructions.push(this.getRandomAction());
        }

    }

}
