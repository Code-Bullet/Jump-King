let minJumpSpeed = 5
let maxJumpSpeed = 22
let maxJumpTimer = 30
let jumpSpeedHorizontal = 8
let terminalVelocity = 20
let gravity = 0.6;

let runSpeed = 4;
let maxBlizzardForce = 0.3;
let blizzardMaxSpeedHoldTime = 150
let blizzardAccelerationMagnitude = 0.003;
let blizzardImageSpeedMultiplier = 50;

let iceFrictionAcceleration = 0.2;
let playerIceRunAcceleration = 0.2;

let mutePlayers = true;

class PlayerState {
    constructor() {
        this.currentPos = createVector(width / 2, height - 200); // this is the top left corner of the hitbox
        this.currentSpeed = createVector(0, 0);
        this.isOnGround = false;


        this.blizzardForce = 0;
        this.blizzardForceAccelerationDirection = 1;
        this.maxBlizzardForceTimer = 0;
        this.snowImagePosition = 0;


        this.bestHeightReached = 0;
        this.bestLevelReached = 0;
        this.reachedHeightAtStepNo = 0;
        this.bestLevelReachedOnActionNo = 0;

        this.brainActionNumber = 0

        this.currentLevelNo = 0;
        this.jumpStartingHeight = 0;
        this.facingRight = true;


        this.isWaitingToStartAction = false;
        this.actionStarted = false;

    }

    getStateFromPlayer(player) {
        this.currentPos = player.currentPos.copy();
        this.currentSpeed = player.currentSpeed.copy();
        this.isOnGround = player.isOnGround


        this.blizzardForce = player.blizzardForce;
        this.blizzardForceAccelerationDirection = player.blizzardForceAccelerationDirection;
        this.maxBlizzardForceTimer = player.maxBlizzardForceTimer;
        this.snowImagePosition = player.snowImagePosition;


        this.bestHeightReached = player.bestHeightReached;
        this.bestLevelReached = player.bestLevelReached;
        this.reachedHeightAtStepNo = player.reachedHeightAtStepNo;
        this.bestLevelReachedOnActionNo = player.bestLevelReachedOnActionNo;
        this.brainActionNumber = player.brain.currentInstructionNumber;

        this.currentLevelNo = player.currentLevelNo;
        this.jumpStartingHeight = player.jumpStartingHeight;
        this.facingRight = player.facingRight;

        this.isWaitingToStartAction = player.isWaitingToStartAction;
        this.actionStarted = player.actionStarted;
    }

    loadStateToPlayer(player) {
        player.currentPos = this.currentPos.copy();
        player.currentSpeed = this.currentSpeed.copy();
        player.isOnGround = this.isOnGround


        player.blizzardForce = this.blizzardForce;
        player.blizzardForceAccelerationDirection = this.blizzardForceAccelerationDirection;
        player.maxBlizzardForceTimer = this.maxBlizzardForceTimer;
        player.snowImagePosition = this.snowImagePosition;

        // player.blizzardForce = 0;
        // player.blizzardForceAccelerationDirection  = 1;
        // player.maxBlizzardForceTimer = 0;
        // player.snowImagePosition = 0;

        player.bestHeightReached = this.bestHeightReached;
        player.bestLevelReached = this.bestLevelReached;
        player.reachedHeightAtStepNo = this.reachedHeightAtStepNo;
        player.bestLevelReachedOnActionNo = this.bestLevelReachedOnActionNo;
        player.brain.currentInstructionNumber = this.brainActionNumber;

        player.currentLevelNo = this.currentLevelNo;
        player.jumpStartingHeight = this.jumpStartingHeight;
        player.facingRight = this.facingRight;


        // player.isWaitingToStartAction = this.isWaitingToStartAction;
        // player.actionStarted = this.actionStarted;
    }

    clone() {
        let clone = new PlayerState();
        clone.currentPos = this.currentPos.copy();
        clone.currentSpeed = this.currentSpeed.copy();
        clone.isOnGround = this.isOnGround


        clone.blizzardForce = this.blizzardForce;
        clone.blizzardForceAccelerationDirection = this.blizzardForceAccelerationDirection;
        clone.maxBlizzardForceTimer = this.maxBlizzardForceTimer;
        clone.snowImagePosition = this.snowImagePosition;


        clone.bestHeightReached = this.bestHeightReached;
        clone.bestLevelReached = this.bestLevelReached;
        clone.reachedHeightAtStepNo = this.reachedHeightAtStepNo;
        clone.bestLevelReachedOnActionNo = this.bestLevelReachedOnActionNo;
        clone.brainActionNumber = this.brainActionNumber;

        clone.currentLevelNo = this.currentLevelNo;
        clone.jumpStartingHeight = this.jumpStartingHeight;
        clone.facingRight = this.facingRight;


        // clone.isWaitingToStartAction = this.isWaitingToStartAction;
        // clone.actionStarted = this.actionStarted;
        return clone;
    }


}

class Player {


    constructor() {
        this.width = 50;
        this.height = 65;

        // this.currentPos = createVector(width / 2, height - 200); // this is the top left corner of the hitbox
        this.currentPos = createVector(width / 2, height - 200); // this is the top left corner of the hitbox
        this.currentSpeed = createVector(0, 0);
        this.isOnGround = false;

        this.jumpHeld = false;
        this.jumpTimer = 0;
        this.leftHeld = false;
        this.rightHeld = false;


        this.facingRight = true;
        this.hasBumped = false;
        this.isRunning = false;
        this.isSlidding = false;
        this.currentRunIndex = 1;
        this.runCycle = [run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run1Image, run2Image, run2Image, run2Image, run2Image, run2Image, run2Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run3Image, run2Image, run2Image, run2Image, run2Image, run2Image, run2Image]
        this.sliddingRight = false;

        // this.currentLevel = null;
        this.currentLevelNo = 0;

        this.jumpStartingHeight = 0;
        this.hasFallen = false;

        this.blizzardForce = 0;
        this.blizzardForceAccelerationDirection = 1;
        this.maxBlizzardForceTimer = 0;
        this.snowImagePosition = 0;


        // ai shit
        this.aiActionTimer = 0;
        this.aiActionMaxTime = 0;
        this.isWaitingToStartAction = false;
        this.actionStarted = false;
        this.brain = new Brain(startingPlayerActions);
        this.currentAction = null;

        this.playersDead = false;


        this.previousSpeed = createVector(0, 0);


        this.bestHeightReached = 0;
        this.bestLevelReached = 0;
        this.reachedHeightAtStepNo = 0;
        this.bestLevelReachedOnActionNo = 0;
        //
        // this.jumpSound = loadSound('sounds/jump.mp3')
        // this.fallSound = loadSound('sounds/fall.mp3')
        // bumpSound = loadSound('sounds/bump.mp3')
        // landSound = loadSound('sounds/land.mp3')

        this.fitness = 0;
        this.hasFinishedInstructions = false;
        this.fellToPreviousLevel = false;
        this.fellOnActionNo = 0;
        this.playerStateAtStartOfBestLevel = new PlayerState();
        this.getNewPlayerStateAtEndOfUpdate = false;


        this.parentReachedBestLevelAtActionNo = 0;
        this.numberOfCoinsPickedUp = 0;
        this.coinsPickedUpIndexes = [];

        this.maxCollisionChecks = 20;
        this.currentNumberOfCollisionChecks = 0;

        this.progressionCoinPickedUp = false;

    }

    ResetPlayer() {
        this.currentPos = createVector(width / 2, height - 200); // this is the top left corner of the hitbox
        this.currentSpeed = createVector(0, 0);
        this.isOnGround = false;

        this.jumpHeld = false;
        this.jumpTimer = 0;
        this.leftHeld = false;
        this.rightHeld = false;


        this.facingRight = true;
        this.hasBumped = false;
        this.isRunning = false;
        this.isSlidding = false;
        this.currentRunIndex = 1;
        this.sliddingRight = false;

        // this.currentLevel = null;
        this.currentLevelNo = 0;

        this.jumpStartingHeight = 0;
        this.hasFallen = false;

        this.blizzardForce = 0;
        this.blizzardForceAccelerationDirection = 1;
        this.maxBlizzardForceTimer = 0;
        this.snowImagePosition = 0;


        // ai shit
        this.aiActionTimer = 0;
        this.aiActionMaxTime = 0;
        this.isWaitingToStartAction = false;
        this.actionStarted = false;

        this.brain.currentInstructionNumber = 0;
        this.currentAction = null;

        this.playersDead = false;
        this.previousSpeed = createVector(0, 0)
        this.bestHeightReached = 0;
        this.reachedHeightAtStepNo = 0;

        this.fitness = 0;
        this.hasFinishedInstructions = false;


    }

    clone() {
        let clone = new Player();
        clone.brain = this.brain.clone();
        clone.playerStateAtStartOfBestLevel = this.playerStateAtStartOfBestLevel.clone();
        clone.brain.parentReachedBestLevelAtActionNo = this.bestLevelReachedOnActionNo;
        return clone;
    }


    loadStartOfBestLevelPlayerState() {

        this.playerStateAtStartOfBestLevel.loadStateToPlayer(this);

    }

    CalculateFitness() {
        // current best fitness max just including height is 640,000, getting a coin has to be the most important thing so
        let coinValue = 500000;
        let heightThisLevel = (this.bestHeightReached - (height * this.bestLevelReached));
        this.fitness = heightThisLevel * heightThisLevel + coinValue * this.numberOfCoinsPickedUp;
    }

    Update() {
        if (this.playersDead)//|| this.hasFinishedInstructions)
            return;
        let currentLines = levels[this.currentLevelNo].lines;
        if (!testingSinglePlayer && !this.hasFinishedInstructions) {
            this.UpdateAIAction()
        }
        this.UpdatePlayerSlide(currentLines);
        this.ApplyGravity()
        this.ApplyBlizzardForce();
        this.UpdatePlayerRun(currentLines);
        this.currentPos.add(this.currentSpeed);
        this.previousSpeed = this.currentSpeed.copy();

        this.currentNumberOfCollisionChecks = 0;
        this.CheckCollisions(currentLines)
        this.UpdateJumpTimer()
        this.CheckForLevelChange();
        this.CheckForCoinCollisions();

        if (this.getNewPlayerStateAtEndOfUpdate) {
            if (this.currentLevelNo !== 37) {
                this.playerStateAtStartOfBestLevel.getStateFromPlayer(this);
            }
            this.getNewPlayerStateAtEndOfUpdate = false;
        }

    }

    ApplyGravity() {
        if (!this.isOnGround) {
            if (this.isSlidding) {
                this.currentSpeed.y = min(this.currentSpeed.y + gravity * 0.5, terminalVelocity * 0.5);
                if (this.sliddingRight) {
                    this.currentSpeed.x = min(this.currentSpeed.x + gravity * 0.5, terminalVelocity * 0.5);
                } else {
                    this.currentSpeed.x = max(this.currentSpeed.x - gravity * 0.5, -terminalVelocity * 0.5);
                }
            } else {

                this.currentSpeed.y = min(this.currentSpeed.y + gravity, terminalVelocity);
            }
        }
    }


    ApplyBlizzardForce() {
        // if(!levels[this.currentLevelNo].isBlizzardLevel)
        //     return;

        if (abs(this.blizzardForce) >= maxBlizzardForce) {
            this.maxBlizzardForceTimer += 1;
            if (this.maxBlizzardForceTimer > blizzardMaxSpeedHoldTime) {
                this.blizzardForceAccelerationDirection *= -1;
                this.maxBlizzardForceTimer = 0;
            }
        }


        this.blizzardForce += this.blizzardForceAccelerationDirection * blizzardAccelerationMagnitude;
        // if the blizzard is faster than max blizzard force
        if (abs(this.blizzardForce) > maxBlizzardForce) {
            this.blizzardForce = maxBlizzardForce * this.blizzardForceAccelerationDirection;
        }


        this.snowImagePosition += this.blizzardForce * blizzardImageSpeedMultiplier;


        if (!this.isOnGround && levels[this.currentLevelNo].isBlizzardLevel) {
            this.currentSpeed.x += this.blizzardForce;
        }


    }

    CheckCollisions(currentLines) {

        let collidedLines = [];
        for (let i = 0; i < currentLines.length; i++) {
            if (this.IsCollidingWithLine(currentLines[i])) {
                collidedLines.push(currentLines[i]);
            }
        }

        let chosenLine = this.GetPriorityCollision(collidedLines)

        let potentialLanding = false;
        if (chosenLine == null) return;

        if (chosenLine.isHorizontal) {
            if (this.IsMovingDown()) {
                // so the player has potentially landed
                //correct the position first then player has landed
                this.currentPos.y = chosenLine.y1 - this.height;

                if (collidedLines.length > 1) {
                    potentialLanding = true;
                    if (levels[this.currentLevelNo].isIceLevel) {
                        this.currentSpeed.y = 0;
                        if (this.IsMovingRight()) {
                            this.currentSpeed.x -= iceFrictionAcceleration;
                        } else {
                            this.currentSpeed.x += iceFrictionAcceleration;
                        }

                    } else {
                        this.currentSpeed = createVector(0, 0)

                    }
                    // print("potentail landing on nooooooo")

                } else {
                    this.playerLanded();
                }

            } else {
                // if moving up then we've hit a roof and we bounce off

                this.currentSpeed.y = 0 - this.currentSpeed.y / 2;
                // ok we gonna need to snap this shit
                this.currentPos.y = chosenLine.y1;
                if (!mutePlayers || testingSinglePlayer) {
                    bumpSound.playMode('sustain');
                    bumpSound.play();
                }

            }


        } else if (chosenLine.isVertical) {
            if (this.IsMovingRight()) {
                this.currentPos.x = chosenLine.x1 - this.width;
            } else if (this.IsMovingLeft()) {
                this.currentPos.x = chosenLine.x1;
            } else {
                //ok so fuck
                //this.bad = true
                // this means we've hit a wall but we arent moving left or right
                // meaning we prioritised the floor first which stopped our velocity
                // so we need a variable to store the speed we had before any transions were made
                if (this.previousSpeed.x > 0) {
                    this.currentPos.x = chosenLine.x1 - this.width;
                } else {
                    this.currentPos.x = chosenLine.x1;
                }
            }
            this.currentSpeed.x = 0 - this.currentSpeed.x / 2;
            if (!this.isOnGround) {
                this.hasBumped = true;
                if (!mutePlayers|| testingSinglePlayer) {
                    bumpSound.playMode('sustain');
                    bumpSound.play();
                }
            }
        } else {
            this.isSlidding = true;
            this.hasBumped = true;

            if (chosenLine.diagonalCollisionInfo.collisionPoints.length === 2) {
                let midpoint = chosenLine.diagonalCollisionInfo.collisionPoints[0].copy();
                midpoint.add(chosenLine.diagonalCollisionInfo.collisionPoints[1].copy());
                midpoint.mult(0.5);

                let left = chosenLine.diagonalCollisionInfo.leftSideOfPlayerCollided;
                let right = chosenLine.diagonalCollisionInfo.rightSideOfPlayerCollided;
                let top = chosenLine.diagonalCollisionInfo.topSideOfPlayerCollided;
                let bottom = chosenLine.diagonalCollisionInfo.bottomSideOfPlayerCollided;

                let playerCornerPos = null;

                if (top && left) {
                    // print("t and l")
                    playerCornerPos = this.currentPos.copy();

                }
                if (top && right) {
                    // print("t and r")
                    playerCornerPos = this.currentPos.copy();
                    playerCornerPos.x += this.width;

                }
                if (bottom && left) {
                    // print("b and l")
                    playerCornerPos = this.currentPos.copy();
                    playerCornerPos.y += this.height;
                    this.sliddingRight = true;
                }
                if (bottom && right) {
                    // print("b and r")
                    playerCornerPos = this.currentPos.copy();
                    playerCornerPos.y += this.height;
                    playerCornerPos.x += this.width;
                    this.sliddingRight = false;
                }
                let correctionX = 0;
                let correctionY = 0;

                if (playerCornerPos === null) {
                    print("fuck");
                    print(left, right, top, bottom);
                    playerCornerPos = this.currentPos.copy();

                    if (this.IsMovingDown()) {
                        playerCornerPos.y += this.height;
                    }
                    if (this.IsMovingRight()) {
                        playerCornerPos.x += this.width;
                    }
                }
                correctionX = midpoint.x - playerCornerPos.x;
                correctionY = midpoint.y - playerCornerPos.y;


                this.currentPos.x += correctionX;
                this.currentPos.y += correctionY;
                // this.currentPos.x += correctionX>0 ? 1:-1;
                // this.currentPos.y += correctionY>0 ? 1:-1;


                //get the current speed based on the dot product of the current veloctiy with the line
                let lineVector = createVector(chosenLine.x2 - chosenLine.x1, chosenLine.y2 - chosenLine.y1)
                lineVector.normalize();
                // print(lineVector);

                let speedMagnitude = p5.Vector.dot(this.currentSpeed, lineVector);
                // print(this.currentSpeed)
                this.currentSpeed = p5.Vector.mult(lineVector, speedMagnitude);
                // print(speedMagnitude,lineVector,this.currentSpeed)
                // this.currentSpeed.x = 0.5*gravity;
                // this.currentSpeed.y = 0.5*gravity;
                if (top) {
                    this.currentSpeed = createVector(0, 0)
                    this.isSlidding = false;
                }


            } else {
                let left = chosenLine.diagonalCollisionInfo.leftSideOfPlayerCollided;
                let right = chosenLine.diagonalCollisionInfo.rightSideOfPlayerCollided;
                let top = chosenLine.diagonalCollisionInfo.topSideOfPlayerCollided;
                let bottom = chosenLine.diagonalCollisionInfo.bottomSideOfPlayerCollided;

                let playerCornerPos = null;
                if (top) {// bounce off the point as if it were horizontal
                    // print("top only");
                    let closestPointY = max(chosenLine.y1, chosenLine.y2)
                    this.currentPos.y = closestPointY + 1;
                    this.currentSpeed.y = 0 - this.currentSpeed.y / 2;

                }
                if (bottom) {//treat like floor
                    // print("bottome only");
                    let closestPointY = min(chosenLine.y1, chosenLine.y2)
                    // this.isOnGround = true
                    this.currentSpeed = createVector(0, 0)
                    // ok we gonna need to snap this shit
                    this.currentPos.y = closestPointY - this.height - 1;

                }
                if (left) {// treat like a left wall
                    // print('left only')
                    this.currentPos.x = max(chosenLine.x1, chosenLine.x2) + 1;
                    if (this.IsMovingLeft())
                        this.currentSpeed.x = 0 - this.currentSpeed.x / 2;
                    if (!this.isOnGround) this.hasBumped = true;
                }
                if (right) {// treat like a right wall
                    // print("right only")
                    this.currentPos.x = min(chosenLine.x1, chosenLine.x2) - this.width - 1;
                    if (this.IsMovingRight())
                        this.currentSpeed.x = 0 - this.currentSpeed.x / 2;

                    if (!this.isOnGround) this.hasBumped = true;
                }


            }


        }
        if (collidedLines.length > 1) {
            // print(chosenLine)
            this.currentNumberOfCollisionChecks += 1;
            if (this.currentNumberOfCollisionChecks > this.maxCollisionChecks) {
                this.hasFinishedInstructions = true;
                this.playersDead = true;
            } else {
                this.CheckCollisions(currentLines);
            }

            //ok so this is gonna need some splaining.
            // so if we've "landed" but it wasnt the last correction then we need to check again if the dude has landed
            // just incase the corrections have moved him off the surface
            if (potentialLanding) {
                if (this.IsPlayerOnGround(currentLines)) {
                    this.playerLanded();
                }

            }
        }

    }

    Show() {
        if (this.playersDead)
            return;
        push();

        //if on the previous level and is up the top, then show
        if (!replayingBestPlayer) {
            if (this.currentLevelNo === population.showingLevelNo - 1) {
                if (this.currentPos.y < this.height) {
                    translate(0, height);

                } else {
                    pop();
                    return;
                }
            }
        }


        translate(this.currentPos.x, this.currentPos.y);

        // if (this.jumpHeld) {
        //     // this.height = this.height / 2
        //     // translate(0, this.height)
        //     image(squatImage,-20,-35 );
        //
        // }else{


        let imageToUse = this.GetImageToUseBasedOnState();

        if (!this.facingRight) {
            push()
            scale(-1, 1);
            if (this.hasBumped) {
                image(imageToUse, -70, -30);
            } else if (imageToUse == jumpImage || imageToUse == fallImage) {
                image(imageToUse, -70, -28);
            } else {
                image(imageToUse, -70, -35);
            }
            pop()
        } else {

            if (this.hasBumped) {
                image(imageToUse, -20, -30);
            } else if (imageToUse == jumpImage || imageToUse == fallImage) {
                image(imageToUse, -20, -28);
            } else {
                image(imageToUse, -20, -35);
            }

        }
        //
        // fill(255, 0, 0);
        // noFill();
        // stroke(255,0,0);
        // strokeWeight(2);
        // // noStroke()
        // rect(0, 0, this.width, this.height);


        // if (this.jumpHeld) {
        //     this.height = this.height * 2
        // }
        pop();


        //show snow
        if (levels[this.currentLevelNo].isBlizzardLevel && (!alreadyShowingSnow||testingSinglePlayer)) {

            let snowDrawPosition = this.snowImagePosition;
            while (snowDrawPosition <= 0) {
                snowDrawPosition += width;
            }
            snowDrawPosition = snowDrawPosition % width;

            // let snowYPosition = (frameCount/2) % height;
            image(snowImage, snowDrawPosition, 0);
            image(snowImage, snowDrawPosition - width, 0);
            // image(snowImage, snowDrawPosition, snowYPosition- height);
            // image(snowImage, snowDrawPosition - width, snowYPosition- height);
            alreadyShowingSnow = true;
        }


    }

    Jump() {
        if (!this.isOnGround) {
            return;
        }

        let verticalJumpSpeed = map(this.jumpTimer, 0, maxJumpTimer, minJumpSpeed, maxJumpSpeed)
        // print(this.jumpTimer,minJumpSpeed,maxJumpSpeed,verticalJumpSpeed )
        if (this.leftHeld) {
            this.currentSpeed = createVector(-jumpSpeedHorizontal, -verticalJumpSpeed)
            this.facingRight = false;
        } else if (this.rightHeld) {
            this.currentSpeed = createVector(jumpSpeedHorizontal, -verticalJumpSpeed)
            this.facingRight = true;

        } else {
            this.currentSpeed = createVector(0, -verticalJumpSpeed)
        }
        this.hasFallen = false;
        this.isOnGround = false
        // print(this.jumpTimer);
        this.jumpTimer = 0
        this.jumpStartingHeight = (height - this.currentPos.y) + height * this.currentLevelNo;
        if (!mutePlayers|| testingSinglePlayer) {
            jumpSound.playMode('sustain');
            jumpSound.play();
        }
    }

    // to determine if we are colliding with any walls or shit we need to do some collision detection
    // this is done by taking the collision of the 4 lines that make up the hitbox

    IsCollidingWithLine(l) {
        if (l.isHorizontal) {
            var isRectWithinLineX = (l.x1 < this.currentPos.x && this.currentPos.x < l.x2) || (l.x1 < this.currentPos.x + this.width && this.currentPos.x + this.width < l.x2) || (this.currentPos.x < l.x1 && l.x1 < this.currentPos.x + this.width) || (this.currentPos.x < l.x2 && l.x2 < this.currentPos.x + this.width);
            var isRectWithinLineY = this.currentPos.y < l.y1 && l.y1 < this.currentPos.y + this.height;
            // if (isRectWithinLineX && isRectWithinLineY) {
            //     print(this.currentPos.x, l.x1, l.x2)
            //     print(isRectWithinLineX, isRectWithinLineY)
            // }
            return isRectWithinLineX && isRectWithinLineY;
        } else if (l.isVertical) {
            isRectWithinLineY = (l.y1 < this.currentPos.y && this.currentPos.y < l.y2) || (l.y1 < this.currentPos.y + this.height && this.currentPos.y + this.height < l.y2) || (this.currentPos.y < l.y1 && l.y1 < this.currentPos.y + this.height) || (this.currentPos.y < l.y2 && l.y2 < this.currentPos.y + this.height);
            isRectWithinLineX = this.currentPos.x < l.x1 && l.x1 < this.currentPos.x + this.width;
            // if (isRectWithinLineX && isRectWithinLineY) {
            //     print(this.currentPos.x, l.x1, l.x2)
            //     print(isRectWithinLineX, isRectWithinLineY)
            // }
            return isRectWithinLineX && isRectWithinLineY;
        } else {
            // ok so we need to check each side of the
            // wait i just realized there is no way that only the l or r side is touching the digonal
            //wait there might be hold on
            // ok jsut check all of them

            let tl = this.currentPos.copy();
            let tr = tl.copy();
            tr.x += this.width;
            let bl = tl.copy();
            bl.y += this.height - 1;
            let br = bl.copy();
            br.x += this.width;

            let leftCollision = AreLinesColliding(tl.x, tl.y, bl.x, bl.y, l.x1, l.y1, l.x2, l.y2);
            let rightCollision = AreLinesColliding(tr.x, tr.y, br.x, br.y, l.x1, l.y1, l.x2, l.y2);
            let topCollision = AreLinesColliding(tl.x, tl.y, tr.x, tr.y, l.x1, l.y1, l.x2, l.y2);
            let bottomCollision = AreLinesColliding(bl.x, bl.y, br.x, br.y, l.x1, l.y1, l.x2, l.y2);

            if (leftCollision[0] || rightCollision[0] || topCollision[0] || bottomCollision[0]) {
                let collisionInfo = new DiagonalCollisionInfo();
                collisionInfo.leftSideOfPlayerCollided = leftCollision[0]
                collisionInfo.rightSideOfPlayerCollided = rightCollision[0];
                collisionInfo.topSideOfPlayerCollided = topCollision[0];
                collisionInfo.bottomSideOfPlayerCollided = bottomCollision[0];

                if (leftCollision[0])
                    collisionInfo.collisionPoints.push(createVector(leftCollision[1], leftCollision[2]))
                if (rightCollision[0])
                    collisionInfo.collisionPoints.push(createVector(rightCollision[1], rightCollision[2]))
                if (topCollision[0])
                    collisionInfo.collisionPoints.push(createVector(topCollision[1], topCollision[2]))
                if (bottomCollision[0])
                    collisionInfo.collisionPoints.push(createVector(bottomCollision[1], bottomCollision[2]))

                l.diagonalCollisionInfo = collisionInfo;
                return true;
            } else {
                return false;
            }


        }


    }


    UpdateJumpTimer() {
        if (this.isOnGround && this.jumpHeld && this.jumpTimer < maxJumpTimer) {
            this.jumpTimer += 1
        }
    }


    IsMovingUp() {
        return this.currentSpeed.y < 0;
    }

    IsMovingDown() {
        return this.currentSpeed.y > 0;
    }

    IsMovingLeft() {
        return this.currentSpeed.x < 0;
    }

    IsMovingRight() {
        return this.currentSpeed.x > 0;
    }

    GetImageToUseBasedOnState() {


        if (this.jumpHeld && this.isOnGround) return squatImage;
        if (this.hasFallen) return fallenImage;
        if (this.hasBumped) return oofImage;
        if (this.currentSpeed.y < 0) return jumpImage;
        if (this.isRunning) {

            this.currentRunIndex += 1;
            if (this.currentRunIndex >= this.runCycle.length) this.currentRunIndex = 0;
            return (this.runCycle[this.currentRunIndex])

        }

        if (this.isOnGround) return idleImage;
        return fallImage;
    }

    UpdatePlayerSlide(currentLines) {
        if (this.isSlidding) {
            if (!this.IsPlayerOnDiagonal(currentLines)) {
                // print("NOT SLIDDING")
                this.isSlidding = false;
            }
        }

    }

    UpdatePlayerRun(currentLines) {
        this.isRunning = false;
        let runAllowed = (!levels[this.currentLevelNo].isBlizzardLevel || this.currentLevelNo === 31 || this.currentLevelNo == 25);
        if (this.isOnGround) {
            if (!this.IsPlayerOnGround(currentLines)) {
                this.isOnGround = false;
                return;
            }
            if (!this.jumpHeld) {
                if (this.rightHeld && runAllowed) {
                    this.hasFallen = false;
                    this.isRunning = true;
                    this.facingRight = true;
                    if (!levels[this.currentLevelNo].isIceLevel) {
                        this.currentSpeed = createVector(runSpeed, 0);
                    } else {
                        this.currentSpeed.x += playerIceRunAcceleration;
                        this.currentSpeed.x = min(runSpeed, this.currentSpeed.x);

                    }

                } else if (this.leftHeld && runAllowed) {
                    this.hasFallen = false;
                    this.isRunning = true;
                    this.facingRight = false;
                    if (!levels[this.currentLevelNo].isIceLevel) {
                        this.currentSpeed = createVector(-runSpeed, 0);
                    } else {
                        this.currentSpeed.x -= playerIceRunAcceleration;
                        this.currentSpeed.x = max(0 - runSpeed, this.currentSpeed.x);
                    }


                } else {
                    if (!levels[this.currentLevelNo].isIceLevel) {
                        this.currentSpeed = createVector(0, 0);
                    } else {
                        this.currentSpeed.y = 0;
                        if (this.IsMovingRight()) {
                            this.currentSpeed.x -= iceFrictionAcceleration;
                        } else {
                            this.currentSpeed.x += iceFrictionAcceleration;
                        }
                        if (abs(this.currentSpeed.x) <= iceFrictionAcceleration) {
                            this.currentSpeed.x = 0;
                        }

                    }
                }


            } else {

                if (!levels[this.currentLevelNo].isIceLevel) {
                    this.currentSpeed = createVector(0, 0);
                } else {
                    this.currentSpeed.y = 0;
                    if (this.IsMovingRight()) {
                        this.currentSpeed.x -= iceFrictionAcceleration;
                    } else {
                        this.currentSpeed.x += iceFrictionAcceleration;
                    }
                    if (abs(this.currentSpeed.x) <= iceFrictionAcceleration) {
                        this.currentSpeed.x = 0;
                    }

                }
            }
        }
    }

    IsPlayerOnGround(currentLines) {
        this.currentPos.y += 1;
        for (let i = 0; i < currentLines.length; i++) {
            if (currentLines[i].isHorizontal && this.IsCollidingWithLine(currentLines[i])) {
                this.currentPos.y -= 1;
                return true;
            }
        }
        this.currentPos.y -= 1;
        return false;
    }

    IsPlayerOnDiagonal(currentLines) {
        this.currentPos.y += 5;
        for (let i = 0; i < currentLines.length; i++) {
            if (currentLines[i].isDiagonal && this.IsCollidingWithLine(currentLines[i])) {
                this.currentPos.y -= 5;
                return true;
            }
        }
        this.currentPos.y -= 5;
        return false;
    }

    GetPriorityCollision(collidedLines) {


        // FIRST EDGE CASES BECAUse I SUCK AT CODING
        //ok so this is gonna need some explaining, i know there is probably a better fix but i think this will work
        //ok so if we are going up and then we hit a verticle and a horizontal and if the midpoint of the vert is lower then
        // we need to do the verticle one first because that should be blocking the horizontal one


        if (collidedLines.length === 2) {
            let vert = null
            let horiz = null;
            let diag = null;
            if (collidedLines[0].isVertical) vert = collidedLines[0]
            if (collidedLines[0].isHorizontal) horiz = collidedLines[0]
            if (collidedLines[0].isDiagonal) diag = collidedLines[0]
            if (collidedLines[1].isVertical) vert = collidedLines[1]
            if (collidedLines[1].isHorizontal) horiz = collidedLines[1]
            if (collidedLines[1].isDiagonal) diag = collidedLines[1]

            if (vert != null && horiz != null) {
                if (this.IsMovingUp()) {
                    if (vert.midPoint.y > horiz.midPoint.y) {
                        return vert;
                    } else {
                        // return horiz;
                    }
                } else {
                    // if(vert.midPoint.y < horiz.midPoint.y ){
                    //     return vert;
                    // }else{
                    //     // return horiz;
                    // }
                }
            }
            if (horiz != null && diag != null) {
                // if (this.IsMovingDown()) {
                //if the digonal one is below the horizontal then always prefer the horiz
                if (diag.midPoint.y > horiz.midPoint.y) {
                    return horiz;
                }
            }
        }


        // check the inverse of the velocity to see if the corrections fit in the range
        let maxAllowedXCorrection = 0 - this.currentSpeed.x;
        let maxAllowedYCorrection = 0 - this.currentSpeed.y;


        //if multiple collisions detected use the one that requires the least correction


        let minCorrection = 10000;
        let maxCorrection = 0;

        let chosenLine = null;
        if (collidedLines.length === 0) return null;

        chosenLine = collidedLines[0];

        if (collidedLines.length > 1) {
            for (let l of collidedLines) {
                let directedCorrection = createVector(0, 0)
                let correction = 10000;
                if (l.isHorizontal) {
                    if (this.IsMovingDown()) {
                        directedCorrection.y = l.y1 - (this.currentPos.y + this.height)

                        correction = abs(directedCorrection)
                        correction = abs(this.currentPos.y - (l.y1 - this.height))
                    } else {
                        // if moving up then we've hit a roof and we bounce off
                        directedCorrection.y = l.y1 - this.currentPos.y;
                        correction = abs(this.currentPos.y - l.y1);
                    }

                } else if (l.isVertical) {
                    if (this.IsMovingRight()) {
                        directedCorrection.x = l.x1 - (this.currentPos.x + this.width);
                        correction = abs(this.currentPos.x - (l.x1 - this.width));
                    } else {
                        directedCorrection.x = l.x1 - this.currentPos.x;

                        correction = abs(this.currentPos.x - l.x1);
                    }
                } else {
                    //this bitch diagonal
                    // so we're moving the point to the diagonal linees
                    // if we get the midpoint of the 2 intersection points then we gucci
                    // if there is only 1 intersection point then just treat it as a wall/ roof
                    if (l.diagonalCollisionInfo.collisionPoints.length === 2) {
                        let midpoint = l.diagonalCollisionInfo.collisionPoints[0].copy();
                        midpoint.add(l.diagonalCollisionInfo.collisionPoints[1].copy());
                        midpoint.mult(0.5);

                        let left = l.diagonalCollisionInfo.leftSideOfPlayerCollided;
                        let right = l.diagonalCollisionInfo.rightSideOfPlayerCollided;
                        let top = l.diagonalCollisionInfo.topSideOfPlayerCollided;
                        let bottom = l.diagonalCollisionInfo.bottomSideOfPlayerCollided;

                        let playerCornerPos = null;
                        if (top && left) {
                            playerCornerPos = this.currentPos.copy();

                        }
                        if (top && right) {
                            playerCornerPos = this.currentPos.copy();
                            playerCornerPos.x += this.width;
                        }
                        if (bottom && left) {
                            playerCornerPos = this.currentPos.copy();
                            playerCornerPos.y += this.height;
                        }
                        if (bottom && right) {
                            playerCornerPos = this.currentPos.copy();
                            playerCornerPos.y += this.height;
                            playerCornerPos.x += this.width;
                        }


                        if (playerCornerPos === null) {
                            print("fuck");
                            print(left, right, top, bottom);
                            playerCornerPos = this.currentPos.copy();

                            if (this.IsMovingDown()) {
                                playerCornerPos.y += this.height;
                            }
                            if (this.IsMovingRight()) {
                                playerCornerPos.x += this.width;
                            }
                        }

                        directedCorrection.x = midpoint.x - playerCornerPos.x;
                        directedCorrection.y = midpoint.y - playerCornerPos.y;
                        correction = dist(playerCornerPos.x, playerCornerPos.y, midpoint.x, midpoint.y)
                    } else {
                        let left = l.diagonalCollisionInfo.leftSideOfPlayerCollided;
                        let right = l.diagonalCollisionInfo.rightSideOfPlayerCollided;
                        let top = l.diagonalCollisionInfo.topSideOfPlayerCollided;
                        let bottom = l.diagonalCollisionInfo.bottomSideOfPlayerCollided;

                        let playerCornerPos = null;
                        if (top) {// bounce off the point as if it were horizontal
                            let closestPointY = max(l.y1, l.y2)
                            directedCorrection.y = closestPointY - (this.currentPos.y)

                            correction = abs(this.currentPos.y - closestPointY);

                        }
                        if (bottom) {//treat like floor
                            let closestPointY = min(l.y1, l.y2)
                            directedCorrection.y = closestPointY - (this.currentPos.y + this.height)
                            correction = abs((this.currentPos.y + this.height) - closestPointY);
                        }
                        if (left) {// treat like a left wall
                            let closestPointX = max(l.x1, l.x2)
                            directedCorrection.x = closestPointX - this.currentPos.x;
                            correction = abs(this.currentPos.x - closestPointX);
                        }
                        if (right) {// treat like a left wall
                            let closestPointX = min(l.x1, l.x2)
                            directedCorrection.x = closestPointX - (this.currentPos.x + this.width);
                            correction = abs((this.currentPos.x + this.width) - closestPointX);
                        }


                    }
                }

                function isBetween(a, b1, b2) {
                    return (b1 <= a && a <= b2) || (b2 <= a && a <= b1)

                }

                if (isBetween(directedCorrection.x, 0, maxAllowedXCorrection) &&
                    isBetween(directedCorrection.y, 0, maxAllowedYCorrection)) {
                    // correction = abs(directedCorrection)
                    if (correction < minCorrection) {
                        minCorrection = correction;
                        chosenLine = l;
                    }

                }


            }
        }
        return chosenLine;
    }

    CheckForLevelChange() {
        if (this.currentPos.y < -this.height) {
            //we are at the top of the screen
            this.currentLevelNo += 1;
            this.currentPos.y += height;


        } else if (this.currentPos.y > height - this.height) {
            if (this.currentLevelNo === 0) {
                //oh no
                // print("fuck me hes goin under")
                this.currentLevelNo = 1; //lol fixed
                this.playersDead = true;
                this.hasFinishedInstructions = true;
            }
            this.currentLevelNo -= 1;
            this.currentPos.y -= height;

            if (!this.hasFinishedInstructions && this.currentLevelNo < this.bestLevelReached - 1) {
                this.fellToPreviousLevel = true;
                this.fellOnActionNo = this.brain.currentInstructionNumber;
                this.hasFinishedInstructions = true;
            }

        }


    }

    UpdateAIAction() {
        // ran every frame
        if (this.isWaitingToStartAction && this.isOnGround) {
            this.isWaitingToStartAction = false;
        }

        //if the action hasnt started yet then start it
        //also if the ai is not on the ground and the action has already started then end the action
        if (this.isOnGround && !this.actionStarted) {
            this.currentAction = this.brain.getNextAction();
            if (this.currentAction === null) {
                this.hasFinishedInstructions = true;
                return;
            }
            this.StartCurrentAction();
            this.actionStarted = true;
        } else if (this.actionStarted) {
            //if the action has been held for long enough then we end the current action
            this.aiActionTimer += 1;
            if (this.aiActionTimer >= this.aiActionMaxTime) {
                this.EndCurrentAction()
                this.actionStarted = false;

            }
        }
    }


    StartCurrentAction() {
        this.aiActionMaxTime = floor(this.currentAction.holdTime * 30);
        this.aiActionTimer = 0;
        if (this.currentAction.isJump) {
            this.jumpHeld = true;
        }
        if (this.currentAction.xDirection === -1) {
            this.leftHeld = true;
            this.rightHeld = false;
        } else if (this.currentAction.xDirection === 1) {
            this.leftHeld = false;
            this.rightHeld = true;
        }
    }

    EndCurrentAction() {
        if (this.currentAction.isJump) {
            this.jumpHeld = false;
            this.Jump();
        }
        this.leftHeld = false;
        this.rightHeld = false;
        this.isWaitingToStartAction = false;


    }

    GetGlobalHeight() {
        return (height - this.currentPos.y) + height * this.currentLevelNo
    }

    playerLanded() {

        // if moving down then weve landed
        this.isOnGround = true
        // if were on an ice level then we slide instead
        if (levels[this.currentLevelNo].isIceLevel) {
            this.currentSpeed.y = 0;
            if (this.IsMovingRight()) {
                this.currentSpeed.x -= iceFrictionAcceleration;
            } else {
                this.currentSpeed.x += iceFrictionAcceleration;
            }

        } else {
            this.currentSpeed = createVector(0, 0)

        }


        this.isSlidding = false;
        this.hasBumped = false;

        if (this.jumpStartingHeight - height / 2 > (height - this.currentPos.y) + height * this.currentLevelNo) {
            this.hasFallen = true;
        }

        if (this.GetGlobalHeight() > this.bestHeightReached) {
            this.bestHeightReached = this.GetGlobalHeight();
            this.reachedHeightAtStepNo = this.brain.currentInstructionNumber;


            if (this.bestLevelReached < this.currentLevelNo) {
                this.bestLevelReached = this.currentLevelNo;
                this.bestLevelReachedOnActionNo = this.brain.currentInstructionNumber;
                // this.playerStateAtStartOfBestLevel.getStateFromPlayer(this);
                this.getNewPlayerStateAtEndOfUpdate = true;


                //setup coins
                this.numberOfCoinsPickedUp = 0;
                this.progressionCoinPickedUp = false;
                if(!levels[this.currentLevelNo].hasProgressionCoins){
                    this.progressionCoinPickedUp = true;

                }
                this.coinsPickedUpIndexes = [];


            }

        }

        // if the ai fell to a previous level then stop the actions and record when it happened
        if (this.currentLevelNo < this.bestLevelReached && this.currentLevelNo !== 23 && !this.hasFinishedInstructions) {
            this.fellToPreviousLevel = true;
            this.fellOnActionNo = this.brain.currentInstructionNumber;
            this.hasFinishedInstructions = true;

        }

        if (!mutePlayers|| testingSinglePlayer) {
            if (this.hasFallen) {
                fallSound.playMode('sustain');
                fallSound.play();
            } else {
                landSound.playMode('sustain');
                landSound.play();
            }
        }
    }

    CheckForCoinCollisions() {
        if (this.currentLevelNo < this.bestLevelReached) {
            return;
        }
        let currentLevel = levels[this.currentLevelNo];
        for (let i = 0; i < currentLevel.coins.length; i++) {
            if (!this.coinsPickedUpIndexes.includes(i)) {
                if (currentLevel.coins[i].collidesWithPlayer(this)) {
                    if (currentLevel.coins[i].type == "reward") {
                        if (this.isOnGround) {
                            this.coinsPickedUpIndexes.push(i);
                            this.numberOfCoinsPickedUp += 1;
                            print("COLLISION COIN THING")
                        }
                    } else {
                        this.coinsPickedUpIndexes.push(i);
                        this.numberOfCoinsPickedUp += 0;  // dont increase coins picked up
                        this.progressionCoinPickedUp = true;
                        print("COLLISION Progress coin")
                    }
                }
            }
        }

    }
}

function AreLinesColliding(x1, y1, x2, y2, x3, y3, x4, y4) {
    let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        let intersectionX = x1 + (uA * (x2 - x1));
        let intersectionY = y1 + (uA * (y2 - y1));
        return [true, intersectionX, intersectionY];
    }
    return [false, 0, 0]

}