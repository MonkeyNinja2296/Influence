

const socket = io()
//I con't get the server to run. IDK what to do.

const prompts = ["Grimmace in the alley way with you", "croissant", "your mom", "a weapon of mass destruction", "Draw yourself as a fairy", "Draw the protagnist for an indie puzzle game about Hamburgers", "draw the last item you purchased", "Draw a picture of your favorite U.S president breaking a stupid law", "draw a pair of sinners running while holding scissors the wrong way", "Draw a fast food mascot kidnapping rabbits from an orphanage", "A bottle filled with something that makes you happy", "Something inside a heart", "Draw your name as an animal.", "Draw a can of soda pouring out rainbows.", "Draw a can of soda pouring out rainbows.", "Draw the moon howling at a wolf.", "Draw a mythical creature cowering in fear from the IRS because they committed tax evasion", "Something that scares you", "Draw a pair of scissors running.", "draw a character from that last media you consumed from memory", "Draw something other than a pot of gold at the end of the rainbow.", "A rabbit with long legs", "Draw a bowl of cereal under the sea.", "a legs with long rabbit", "Draw a cactus in a milkshake.", "Draw the moon fighting the sun over a turkey sandwich.", "Draw a design for a $3 bill.", "Draw a stick figure doing a backflip over a vegetable 10x his size", "Draw an apple talking to your art teacher.", "Draw chicken wings flying.", "Draw a teacher eating pizza while dancing.", "an odd pose.", "Draw a bicycle riding a bicycle.", "Draw the crowd.", "Draw a pair of shoes made out of flowers.", "Draw Grant. In the most abstract way possible", "Draw an apple talking to your art teacher.", "Draw a rainstorm of sprinkles.", "Draw an animal taking a human for a walk.", "Combine two holidays to make a new one.", "Draw the Eiffel Tower eating a baguette.", "Draw a stick figure falling.", "a twelve item menu.", "Draw a treasure chest in an underground cave.", "Draw what is in the rearview mirror of the car.", "Draw a fish swimming in something other than water.", "Draw 3 essential items that you would use while being chased by the Mafia", "Draw a dragon breathing rainbows.", "Draw five objects with interesting textures", "Draw a troll riding a unicorn.", "Draw a foot doing a handstand.", "Draw all the contents of your junk drawer with one continuous line.", "Draw a sweater made out of candy.", "Draw a super scary Valentine’s Day card.", "Draw the funniest U.S President inside of the universe of a Shakespeare Play", "Draw a snowman sailing.", "Make a drawing that looks sticky.", "Yo wtf I keep getting spammed", "Draw lightning striking the tallest building in the world.", "Draw what’s under your bed", "Draw something you keep putting off, or something that causes you to procrastinate.", "Draw Misty(Grants Cat), misty stepping into a deep mist, of wistful creatures", "How many prompts do you guys need??????", "I need to silence this server one sec", "Oh goodness", "Draw thats a good one", "A pirate trying to sword fight with a", "A giant pickle taking over the tri state area"];
let influnetialPrompts = ["make it look like a pirate"]
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "o", "p", "q", "r",
  "s", "t", "u", "v", "w", "x", "y", "z"];
// I am having a hard time right now AHHHHHHHHHHHHH sotp failing please
let isHost = false;
let isClient = false;

let onMobile = false;
let lastDraw = false;
let drawSize = 10;
let drawColor = "red";

let undoButton;


let drawSlider;
let drawSliderLastValue = 5;

let round = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let hostButton;
let currentRoomCode = "";
let inputCode;
let nameInput;
let sprites = [];
let timer = -1;
let setTimer = 80;

let isInfluencing = false;

let isDisconected = false;

let currentPrompt = -1;


class player {
  constructor(name, id, score, timeTillKill = 10, CP = []) {
    this.name = name;
    this.id = id;
    this.score = score
    this.timeTillKill = timeTillKill;
    this.CP = CP;
  }
}
me = new player("Player", -1, 0)
let tempMe = new player("Player", -1, 0);
let spriteOrder = [];
let spritesToDraw = [];
let response = [];

setInterval(() => {
  resizeCanvas(window.innerWidth, window.innerHeight);
}, 1000)
let cnv
async function setup() {
  filter(BLUR, -100)
  cnv = createCanvas(window.innerWidth, window.innerHeight);
  background(153);
  textSize(40)
  let video;

  text("Loading...", width / 2, height / 2)
  createHostButton();
  createInputCode();
  createNameInput();
  sprites = ['Sprites/DiamondPickaxe.png',
    'Sprites/New Piskel (2).gif', 'Sprites/New Piskel (3).gif', 'Sprites/New Piskel (4).gif', 'Sprites/New Piskel (39).png', 'Sprites/New Piskel (40).png', 'Sprites/New Piskel (41).png', 'Sprites/New Piskel (42).png'];
  let temp = [];
  for (let i = 0; i < sprites.length; i++) {
    temp.push(i)
  }
  for (let i = 0; i < temp.length; i++) {
    console.log(temp + "   " + spriteOrder)
    let randomNumber = random(0, temp.length);
    spriteOrder.push(temp.splice(randomNumber, 1)[0]);
    i--;
  }
  if (getItem("me") != null) {
    tempMe = getItem("me");
    createReconectButton();
  }
}

let txt;
let topText;
let tutorialDone = false;
let tutorialStarted = false;
let percentageOfScoreBar = 0;

let playerOne = null;
let playerTwo = null;


async function draw() {
  //background(153);
  let w = width
  let h = height
  textSize(20)

  if (isHost){
    hostDraw()
  }else {
    fill("white")
    rect(0, 0, width, height)
  }



  textAlign(CENTER);
  textSize(50)
  fill("black")
  text(txt, 0, height / 2, width, height / 2)
  if (!isHost) {
    if (currentPrompts.length > 0) {
      topText = currentPrompts[0].text;
    } else {
      topText = "";
    }
  }
  textSize(20)
  if (height / 2 - 325 < 0) {
    text(topText, 0, 0, width)
  } else {
    text(topText, 0, height / 2 - 325, width)
  }

  if (!onMobile && touches.length > 0) {
    onMobile = true;
  }
  if (isHost || submitButton == null) {
    return;
  }
  cnv.touchStarted(() => {

    lastDraw = false;
    prevMouseX = 0;
    prevMouseY = 0;

  })
  cnv.touchEnded(() => {

    lastDraw = true;
  })

  if (drawSlider) {
    drawSize = drawSlider.value();
    if (drawSize != drawSliderLastValue) {
      response.push("sW" + drawSize)
    } else if (response.length == 0) {
      response.push("sW" + drawSize)
      response.push("CC" + colorPicker.value())
    }
  }
  if (response[response.length - 1] != "END" &&
    typeof response[response.length - 1] === 'object' && !mouseIsPressed) {
    response.push("END");
  }
  if (lastDraw) {


  } else {


    strokeWeight(drawSize);
    fill(drawColor)

    if (mouseIsPressed) {
      stroke(drawColor);
      if (mouseX > w / 2 + 150 || mouseX < w / 2 - 150 || mouseY > h / 2 + 75 || mouseY < h / 2 - 225 || prevMouseX > w / 2 + 150 || prevMouseX < w / 2 - 150 || prevMouseY > h / 2 + 75 || prevMouseY < h / 2 - 225) {
        console.log("No draw")
      } else {

        line(mouseX, mouseY, prevMouseX, prevMouseY)
        //uncomment below if you want it to be a drawing game
        response.push({ a: { x: mouseX, y: mouseY }, b: { x: prevMouseX, y: prevMouseY } })
      }
    }
  }
  stroke("green")
  strokeWeight(3);
  fill("white")
  rect(w / 2 - 150, h / 2 - 225, 300, 300);
  strokeWeight(drawSize);
  stroke(drawColor);
  for (let i = 0; i < response.length; i++) {
    if (typeof response[i] === 'object') {
      if (response[i].a.x == response[i].b.x && response[i].a.y == response[i].b.y) {
        line(response[i].a.x, response[i].a.y, response[i].b.x + 1, response[i].b.y + 1)
      }
      line(response[i].a.x, response[i].a.y, response[i].b.x, response[i].b.y)
    } else {

      if (response[i].substring(0, 2) == "sW") {
        strokeWeight(response[i].substring(parseInt(2)))

      } else if (response[i].substring(0, 2) == "CC") {
        noErase();
        stroke(response[i].substring(2))
      } else if (response[i] == "erase") {

        erase()
      }

    }
  }
  noErase();
  strokeWeight(1);

  prevMouseX = mouseX;
  prevMouseY = mouseY;
  if (drawSlider) {
    drawSliderLastValue = drawSlider.value();
  }

}

function createHostButton() {
  hostButton = createButton('Host');
  hostButton.size(100, 50);
  hostButton.position(width / 2 - 50, height / 2 - 100);
  hostButton.mousePressed(() => {
    let code = "" + random(letters) + random(letters) + random(letters) + random(letters) + random(letters);
    isHost = true;

    socket.emit("make room", code);
    txt = code;
    removeElements(hostButton)
  });
}
let submitButton;
let pressedSubmitButton = false
function createSubmitButton() {
  submitButton = createButton('SUBMIT');
  submitButton.size(100, 50);
  submitButton.position(width / 2 - 50, height / 2 + 100);
  submitButton.mousePressed(() => {
    pressedSubmitButton = true;
    let j = width
    let i = height
    response.push("x" + j)
    response.push("y" + i)
    response.push("me" + me.id)
    console.log(response);
    socket.emit("save", response, currentRoomCode, me.id, currentPrompts, true);
    removeElements()
    responce = [];

  });
}
function createEraserButton() {
  submitButton = createButton('ERASE');
  submitButton.size(50, 50);
  submitButton.position(width / 2 + 50, height / 2 - 275);
  submitButton.mousePressed(() => {


    response.push("erase")

  });
}

function createSkipButton() {
  submitButton = createButton('Skip tutorial');
  submitButton.size(100, 50);
  submitButton.position(width / 2 - 50, height / 2 + 100);
  submitButton.mousePressed(() => {

    socket.emit("skip", currentRoomCode);
    removeElements()
  });
}

let startButton;
function createStartButton() {
  startButton = createButton('Start');
  startButton.size(100, 50);
  startButton.position(width / 2 - 50, height / 2 + 100);
  startButton.mousePressed(() => {


    socket.emit("Start", currentRoomCode);
    removeElements()
  });
}
function createSizeSlider() {
  drawSlider = createSlider(1, 10, 5, 1)
  drawSlider.position(width / 2 - 150, height / 2 - 250).size(80)
}
let colorPicker;
function createColorGrab() {
  console.log("Is the color picker created?")
  colorPicker = createColorPicker('deeppink');
  colorPicker.position(width / 2 - 50, height / 2 - 250).size(80)
  colorPicker.changed(() => {
    response.push("CC" + colorPicker.value());
  });
}
let reconectButton;
function createReconectButton() {
  reconectButton = createButton('Re-connect');
  reconectButton.size(100, 50);
  reconectButton.position(width / 2 - 50, height / 2 + 200);
  reconectButton.mousePressed(() => {


    socket.emit("can reconect", me, tempMe[1]);

  });
}


function createUndoButton() {
  undoButton = createButton('↩️');
  undoButton.size(50, 50);
  undoButton.position(width / 2 + 100, height / 2 - 275);
  undoButton.mousePressed(() => {
    let foundFirst = false;
    for (let i = response.length - 1; i >= 0; i--) {
      if (response[i] == "END" && !foundFirst) {
        foundFirst = true;

      } else if (response[i] == "END" && foundFirst) {
        response.push("sW" + drawSlider.value());
        break;
      }
      if (foundFirst) {
        response.splice(i, 1);

      }
    }
  });
}

let responseInput;
function createInputResponce() {
  responseInput = createInput('').attribute('maxlength', 50)
  responseInput.size(200, 50);
  responseInput.position(width / 2 - 100, height / 2 - 100);
  responseInput.elt.placeholder = 'EX: Why did the chicken cross the road? Because his name was gary!';
  responseInput.input(() => {
    //response = responseInput.value();
    //removeElements();
  })
}
function createInputCode() {
  inputCode = createInput('')
  inputCode.size(100, 50);
  inputCode.position(width / 2 - 50, height / 2);
  inputCode.elt.placeholder = 'EX: XXXXX';
  inputCode.changed(() => {
    socket.emit("join room", inputCode.value().toLowerCase(), me);

    //removeElements();
  })
}
function createNameInput() {
  nameInput = createInput('').attribute('maxlength', 30)
  nameInput.size(100, 50);
  nameInput.position(width / 2 - 50, height / 2 - 200);
  nameInput.elt.placeholder = 'EX: NAME';
  nameInput.changed(() => {
    me.name = nameInput.value();
    //removeElements();
  })
}
let votingTime = false;
function voteBegin() {
  timer = -12;
  socket.emit("Y'all should save", currentRoomCode);
  setTimeout(() => {
    votingTime = true;
    timer = 0;
    for (let i = 0; i < players.length; i++) {
      if (curInput[i] == null) {
        curInput[i] = [{ text: i, Pid: i, id: promptNumbers[i][0] }, { text: i, Pid: i, id: promptNumbers[i][1] }]
      }
    }
  }, 3000)

  //socket.emit("vote begin",currentRoomCode);

}






socket.on("room code", function(number) {
  currentRoomCode = number;
  storeItem('me', [me, currentRoomCode, response])
})
socket.on("save now", function() {
  if (!isHost) {
    let j = width
    let i = height
    response.push("x" + j)
    response.push("y" + i)
    response.push("me" + me.id)
    console.log(response);
    socket.emit("save", response, currentRoomCode, me.id, currentPrompts, false);
  }
})
socket.on("room not found", function(number) {
  console.log("Room not found")
})
socket.on("id", function(number) {
  console.log(number)
  me.id = number;
  storeItem('me', [me, currentRoomCode, response])
  removeElements()
  txt = "wait for game to begin"

  if (me.id == 0) {
    createStartButton()
    txt = "Start the game when ready";
  }
})
let players = [];
socket.on("Player info", function(info) {

  players = info;
})
let curInput = [];
let finalInputs = [];
socket.on("input", function(input, id, prompt, isGood) {
  console.log("Got input")
  curInput[id] = []
  curInput[id][0] = prompt
  console.log(isGood)
  if (isGood) {
    finalInputs[id] = true;
    spritesToDraw[id].position(spritesToDraw[id].x, height / 2)
  }


  curInput[id][1] = input;



})
let theGameHasBegun = false;
socket.on("start", function() {
  theGameHasBegun = true;
  storeItem('me', [me, currentRoomCode, response]);
  if (!isHost) {
    removeElements()
    txt = "Wait for tutorial";
    if (me.id == 0) {
      createSkipButton();
    }
  }
})
let currentPrompts = []
let promptNumbers = []
socket.on("round start", function() {
  round++;
  if (round >= 4) {
    socket.emit("end game", currentRoomCode);
    txt = "GAME DONE";
    return;
  }
  txt = "";
  if (!isHost) {
    //topText = "Say a funny";
    response = [];
    removeElements();

    createSubmitButton()
    createSizeSlider()
    createUndoButton()
    createColorGrab()
    createEraserButton()

    currentPrompts = [];
    me.CP = currentPrompts;
    storeItem('me', [me, currentRoomCode, response])
  }
  if (isHost) {

    promptNumbers = [];
    for (let i = 0; i < players.length; i++) {
      promptNumbers.push(i);
    }
    curInput = [];
    finalInputs = [];
    currentPrompts = [];
    for (let i = 0; i < spritesToDraw.length; i++) {
      spritesToDraw[i].position(width / players.length * i, height - 150)
    }
    timer = setTimer;

    for (let i = 0; i < players.length; i++) {

      let prompt = { text: random(prompts), id: i, player1: i, player2: 0 }






      currentPrompts.push(prompt);
      socket.emit("prompt", prompt, currentRoomCode)


      
    }

  }
})
socket.on("end round", function() {
  if (!isHost) {
    console.log("end round")

    let j = width
    let i = height
    response.push("x" + j)
    response.push("y" + i)
    response.push("me" + me.id)
    console.log(response);
    socket.emit("save", response, currentRoomCode, me.id, currentPrompts, true);


    responce = [];
    topText = "";

    me.CP = currentPrompts;
    storeItem('me', [me, currentRoomCode, response])
    txt = "Wait for voting to begin"
    removeElements()
  } else {
    voteBegin()
  }

})

socket.on("prompt", function(prompt) {
  if (prompt.player1 == me.id || prompt.player2 == me.id) {
    currentPrompts.push(prompt);
    me.CP = currentPrompts;
    storeItem('me', [me, currentRoomCode, response]);
  }
})
let voteButton1
let voteButton2
let votedBefore = 0;

socket.on("vote", function(p1, p2) {
  if (!isHost) {
    currentPrompts = [];
    me.CP = currentPrompts;
    storeItem('me', [me, currentRoomCode, response])
    txt = "";
    removeElements();
    voteButton1 = createButton("LEFT").position(0, height / 4).size(width, 100).mousePressed(() => {
      socket.emit("vote", currentRoomCode, 1, me.id, votedBefore);
      votedBefore = 1;
    });
    voteButton2 = createButton("RIGHT").position(0, height / 4 + 105).size(width, 100).mousePressed(() => {

      socket.emit("vote", currentRoomCode, 2, me.id, votedBefore);
      votedBefore = 2;
    });
  } else {
    /*for(let i = 0; i < players.length; i++){
      if(curInput[i] == null){
        curInput[i] = [{text:"LOADING...",id:promptNumbers[i][0],Pid:i},{text:"LOADING...",id:promptNumbers[i][1],Pid:i}]
      }
    }*/
    for (let i = 0; i < players.length; i++) {
      spritesToDraw[i].position(width / players.length * i, height - 150)
    }
  }
})

let p1Votes = 0;
let p2Votes = 0;
let playersWhoVoted = [];

socket.on("playerVoted", function(player, id, prevVote) {
  if (playersWhoVoted.includes(id)) {
    console.log(prevVote)
    if (prevVote == 1) {
      p1Votes--;
    } else {
      p2Votes--;
    }
  } else {
    playersWhoVoted.push(id)
  }
  if (player == 1) {
    p1Votes++;
    spritesToDraw[id].position(0, height / 8 * id + 25)
  } else {
    p2Votes++;
    spritesToDraw[id].position(width / 1.2, height / 8 * id + 25)
  }

})

socket.on("playerScore", function(id, score) {
  if (me.id == id) {
    me.score += score * 1000;
  }
  storeItem('me', [me, currentRoomCode, response])
})
let scoreTime = false;
socket.on("score time", function() {
  if (isHost) {
    scoreTime = true;
    timer = 20;

  } else {
    txt = "Score time!";
    removeElements();
  }

})
socket.on("changeID", function(num) {
  if (theGameHasBegun) return;
  console.log("player die")

  if (me.id > num && !theGameHasBegun) {
    me.id--;
    storeItem("me", [me, currentRoomCode]);
  }

  if (me.id == 0) {
    createStartButton();
  }
  if (isHost && !theGameHasBegun) {
    players.splice(num, 1);
    removeElements();
    spritesToDraw = [];
  }

})
socket.on("reconect", function() {
  removeElements();
  console.log("reconect")
  me = tempMe[0];
  theGameHasBegun = true;
  currentPrompts = me.CP;
  currentRoomCode = tempMe[1];

  if (me.CP[0]) {
    response = tempMe[2]
    createSubmitButton()
    createSizeSlider()
    createUndoButton()
    createColorGrab()
    createEraserButton()

  }
})


socket.on("skip", function() {
  if (isHost) {
    video.speed(5)
    console.log(video.elt.duration);
  }

})

socket.on("influence", function(input, arr) {
  if (!isHost) {
    console.log(input);
    response = input[arr[me.id]][1]

    currentPrompts[0].text = random(influnetialPrompts)
    console.log(response[response.length - 2])
    console.log(response[response.length - 3])
    let y = parseInt(response[response.length - 2].substring(1))
    let x = parseInt(response[response.length - 3].substring(1))
    console.log(x + " :X && " + y + ": Y")
    for (let i = 0; i < response.length; i++) {
      console.log(width - x)
      if (typeof response[i] === 'object') {
        response[i].a.x += (width - x) / 2;
        response[i].a.y += (height - y) / 2;
        response[i].b.x += (width - x) / 2;
        response[i].b.y += (height - y) / 2;
      }
    }
    createSubmitButton()
    createSizeSlider()
    createUndoButton()
    createColorGrab()
    createEraserButton()
  } else {
    timer = 80;
    
  }

})

setInterval(function() {
  if (!isHost) {
    socket.emit("player information", currentRoomCode, me)
  }
}, 1000)

setInterval(function() {
  if (!isHost) {
    storeItem('me', [me, currentRoomCode, response])
  }
}, 1000)