let screensPerRound = 3;
let currentScreen

function hostDraw() {

  let w = width
  let h = height
  background(255)
  fill('black')

  for (let i = 0; i < players.length; i++) {
    //sprites[spriteOrder[i]].style('pagespeed_no_transform')
    if (spritesToDraw[i] == null && i < sprites.length) {
      spritesToDraw[i] = createElement('img').style('image-rendering', 'pixelated').position(w / 4, i * h / 8 + 25).size(50, 50)
      spritesToDraw[i].elt.src = sprites[spriteOrder[i]];
    }
    textAlign(LEFT);
    text(i + 1 + ". " + players[i].name, spritesToDraw[i].x, spritesToDraw[i].y);
  }
  
  if (votingTime) {
    textSize(20)
    if (currentPrompt != -1) {
      textAlign(CENTER);
      if (currentPrompt == 0) {
        text(currentPrompts[currentPrompts.length - 1].text, 0, 100, width);
      } else {
        text(currentPrompts[currentPrompt - 1].text, 0, 100, width);
      }
    }
    if (playerOne) {

      strokeWeight(drawSize);
      stroke(drawColor);
      for (let i = 0; i < playerOne.length; i++) {
        if (typeof playerOne[i] === 'object') {

          if (playerOne[i].a.x == playerOne[i].b.x && playerOne[i].a.y == playerOne[i].b.y) {
            line(playerOne[i].a.x - 150, playerOne[i].a.y, playerOne[i].b.x - 149, playerOne[i].b.y + 1)
          }
          line(playerOne[i].a.x - 150, playerOne[i].a.y, playerOne[i].b.x - 150, playerOne[i].b.y)
        } else {

          if (playerOne[i].substring(0, 2) == "sW") {
            strokeWeight(playerOne[i].substring(parseInt(2)))
          } else if (playerOne[i].substring(0, 2) == "CC") {
            noErase()
            stroke(playerOne[i].substring(2))
          } else if (playerOne[i] == "erase") {

            erase()
          }
        }
      }
      noErase();
      for (let i = 0; i < playerTwo.length; i++) {
        if (typeof playerTwo[i] === 'object') {

          if (playerTwo[i].a.x == playerTwo[i].b.x && playerTwo[i].a.y == playerTwo[i].b.y) {
            line(playerTwo[i].a.x + 150, playerTwo[i].a.y, playerTwo[i].b.x + 151, playerTwo[i].b.y + 1)
          }
          line(playerTwo[i].a.x + 150, playerTwo[i].a.y, playerTwo[i].b.x + 150, playerTwo[i].b.y)
        } else {

          if (playerTwo[i].substring(0, 2) == "sW") {
            strokeWeight(playerTwo[i].substring(parseInt(2)))
          } else if (playerTwo[i].substring(0, 2) == "CC") {
            noErase()
            stroke(playerTwo[i].substring(2))
          } else if (playerTwo[i] == "erase") {

            erase()
          }
        }
      }

    }
    noErase()

    stroke("black")
    strokeWeight(1)
  }
  


  if (tutorialStarted == false && theGameHasBegun) {
    startScreen()
  }

  
  if (timer > 0) {
    textAlign(CENTER);
    text(Math.round(timer) + " ", 0, 25, w)
    timer -= deltaTime / 1000;
    if (timer < 0) {
      timer = 0;
    }
    if (finalInputs.length == players.length && !votingTime) {
      let everyOneSubbmitted = true
      for (let i = 0; i < finalInputs.length; i++) {
        if (!finalInputs[i]) {
          everyOneSubbmitted = false;
          break;
        }
      }
      if (everyOneSubbmitted) {
        timer = 0;
      }
    }
  }

  
  if (scoreTime) {
    if (percentageOfScoreBar < 1) {
      percentageOfScoreBar += .01;
    }
    for (let i = 0; i < players.length; i++) {
      fill("green")
      rect(w / 8 * i, height - players[i].score * percentageOfScoreBar / (20000 / h), 50, players[i].score * percentageOfScoreBar / (20000 / h))
      spritesToDraw[i].position(w / 8 * i, height - players[i].score * percentageOfScoreBar / (20000 / h) - 50)
    }
  }

  
  if (Math.round(timer) == 0 && !votingTime && !scoreTime && !isInfluencing) {

    isInfluencing = true;
    // end of round
    socket.emit("Y'all should save", currentRoomCode)
    setTimeout(() => {
      let arrs = [players.length - 1];
      for (let i = 0; i < players.length - 1; i++) {
        arrs.push(i)
      }
      console.log(curInput)
      socket.emit("influence", currentRoomCode, curInput, arrs)
      console.log("influence");
      curInput = [];
      finalInputs = [];
      for (let i = 0; i < spritesToDraw.length; i++) {
        spritesToDraw[i].position(width / players.length * i, height - 150)
      }
    }, 3000)
    timer = -11;
  }

  else if (Math.round(timer) == 0 && votingTime && curInput.length > 0 && !scoreTime) {

    timer = 20;
    if (currentPrompt != -1 && playerOne) {
      socket.emit("score", currentRoomCode, parseInt(playerOne[playerOne.length - 1].substring(2)), p1Votes)
      socket.emit("score", currentRoomCode, parseInt(playerTwo[playerTwo.length - 1].substring(2)), p2Votes)
    }

    currentPrompt++;

    if (currentPrompt >= players.length) {
      curInput = []
      finalInputs = [];
      votingTime = false;
      currentPrompt = -1;
      socket.emit("show score", currentRoomCode)
      percentageOfScoreBar = 0;
      timer = setTimer;
    } else {

      let p1 = null;
      let p2;
      for (let i = 0; i < curInput.length; i++) {

        if (curInput[i][0][0].id == currentPrompt) {
          if (p1 == null) {
            p1 = curInput[i][1];
            let y = parseInt(p1[p1.length - 2].substring(1))
            let x = parseInt(p1[p1.length - 3].substring(1))
            console.log(x + " :X && " + y + ": Y")
            for (let i = 0; i < p1.length; i++) {
              console.log(width - x)
              if (typeof p1[i] === 'object') {
                p1[i].a.x += (width - x) / 2;
                p1[i].a.y += (height + 200 - y) / 2;
                p1[i].b.x += (width - x) / 2;
                p1[i].b.y += (height + 200 - y) / 2;
              }
            }
            p2 = [];
            for (let i = 0; i < p1.length; i++) {
              if (typeof p1[i] != 'object' && p1[i].substring(0, 2) == "me") {
                p2.push(p1[i])
                break;
              } else {
                p2.push(p1[i])
              }
            }
          } else {
            p2 = curInput[i][1];
          }
        }


      }
      console.log(p1)
      if (!p1) {
        currentPrompt++;
        timer = 0;
        return;
      }
      playerOne = p1;
      playerTwo = p2;
      socket.emit("Vote", currentRoomCode, p1, p2)
    }

  }

    
  else if (scoreTime && Math.round(timer) == 0) {
    timer = -11;
    socket.emit("begin game", currentRoomCode)
    curInput = [];
    scoreTime = false;
  } 
    
  else if (Math.round(timer) == 0 && !votingTime && !scoreTime && isInfluencing) {
    isInfluencing = false;
    // end of round
    socket.emit("end round", currentRoomCode)
    timer = -10;
  }

}

function startScreen(){
  video = createVideo('Videos/example.mp4').size(w, h).position(0, 0).onended(() => {
    video.remove();
    tutorialDone = true;
    socket.emit("begin game", currentRoomCode)
  });
  video.play()
  tutorialStarted = true;
}

function screen1(){
  
}

function screen2(){

}

function screen3(){

}

function screen4(){

}