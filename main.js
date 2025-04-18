const truck = document.getElementById("truck");
const boxGrid = document.getElementById("boxgrid");
const boxGridSlots = document.getElementById("boxgrid").querySelectorAll(".box");
const treadmill = document.getElementById("treadmill");
const selectedBoxDisplayCursor = document.getElementById("selectedBoxDisplayCursor")

var gameStarted = false;
var boxSelected = "none";
var score = 0;





function startGame() {
    gameStarted = true;
    checkIfGameStarted()
}
function checkIfGameStarted() {
    if (gameStarted) {



        treadmill.classList.add("started");
        let treadmillBoxGeneration = setInterval(() => {
            let box = document.createElement("div");

            let possibilities = ["smallbox","smallbox","mediumbox1","largebox"]
            let boxtype = possibilities[Math.floor(Math.random() * 4)]

            box.innerHTML = `<img src="assets/${boxtype}.png">`;
            box.classList = "treadmill-box";
            box.style.left = `${Math.floor(Math.random() * 50 + 5)}%`;
            box.style.zIndex = 5;

            treadmill.appendChild(box);

            box.addEventListener("click", event => {
                if (boxSelected == "none") {
                    boxSelected = boxtype;
                    selectedBoxDisplayCursor.src = `assets/${boxtype}.png`;
                    selectedBoxDisplayCursor.style.width = "70px";
                    if (boxtype == "largebox") {
                        selectedBoxDisplayCursor.style.width = "140px";
                    }
                    
                    box.remove();
                    boxGridSlots.forEach(slot => {
                        if (testIfSlotIsFree(slot)) {
                            slot.classList.add("selectMode");
                        }
                    })
                }
            })

            setTimeout(() => {
                box.remove()
            }, 10000);
        }, 1400);

        document.addEventListener("mousemove", event => {
            selectedBoxDisplayCursor.style.left = `${event.screenX + 25}px`;
            selectedBoxDisplayCursor.style.top = `${event.screenY - 125}px`;
        })





        boxGridSlots.forEach((slot, index) => {
            slot.addEventListener("click", event => {

                let Free = testIfSlotIsFree(slot)

                if (Free && boxSelected != "none") {

                    if (boxSelected == "smallbox") {
                        slot.classList.add(`${boxSelected}`);
                        slot.firstChild.src = `assets/${boxSelected}.png`;
                    } else if (boxSelected == "mediumbox1") {
                        if (!slot.classList.contains("R4") && testIfSlotIsFree(boxGridSlots[(index + 7)])) {
                            slot.classList.add(`${boxSelected}`);
                            boxGridSlots[(index + 7)].classList.add("notFree");
                            slot.firstChild.src = `assets/${boxSelected}.png`;
                        }
                    } else if (boxSelected == "mediumbox2") {
                        if (!slot.classList.contains("C7") && testIfSlotIsFree(boxGridSlots[(index + 1)])) {
                            slot.classList.add(`${boxSelected}`);
                            boxGridSlots[(index + 1)].classList.add("notFree");
                            slot.firstChild.src = `assets/${boxSelected}.png`;
                        }
                    } else if (boxSelected == "largebox") {
                        if ((!slot.classList.contains("C7") || !slot.classList.contains("R4")) && testIfSlotIsFree(boxGridSlots[(index + 7)]) && testIfSlotIsFree(boxGridSlots[(index + 8)]) && testIfSlotIsFree(boxGridSlots[(index + 1)])) {
                            slot.classList.add(`${boxSelected}`);
                            boxGridSlots[(index + 7)].classList.add("notFree");
                            boxGridSlots[(index + 8)].classList.add("notFree");
                            boxGridSlots[(index + 1)].classList.add("notFree");
                            slot.firstChild.src = `assets/${boxSelected}.png`;
                        }
                    }
                    boxSelected = "none";
                    selectedBoxDisplayCursor.src = "";
                    boxGridSlots.forEach(slot => {
                        slot.classList.remove("selectMode");
                    })

                    let truckFull = true;
                    boxGridSlots.forEach(slot => {
                        if (testIfSlotIsFree(slot)) {
                            truckFull = false;
                        }
                    })
                    if (truckFull) {
                        nextTruck();
                    }

                } else if (Free && boxSelected == "none") {
                    alert("Escolha uma caixa na esteira!")
                } else if (!Free && boxSelected != "none") {
                    alert("Esse lugar já está ocupado")
                }
                
            })
        })

        let rotateMediumBox = function(){
            if (boxSelected == "mediumbox1") {
                boxSelected = "mediumbox2";
                selectedBoxDisplayCursor.src = "assets/mediumbox2.png";
                selectedBoxDisplayCursor.style.width = "140px";
            }  else if (boxSelected == "mediumbox2") {
                boxSelected = "mediumbox1";
                selectedBoxDisplayCursor.src = "assets/mediumbox1.png";
                selectedBoxDisplayCursor.style.width = "70px";
            }
        }
        document.addEventListener("keydown",rotateMediumBox)


    }
}


function testIfSlotIsFree(slot) {
    let free = true;
    if (slot.classList.contains("smallbox") || slot.classList.contains("mediumbox1") || slot.classList.contains("mediumbox2") || slot.classList.contains("largebox") || slot.classList.contains("notFree")) {
        free = false;
    }
    return free;
}
function nextTruck() {
    score++;
    document.getElementById("score").innerText = `PONTUAÇÃO: ${score}`
    truck.style.animation = "truckGoOff 2s ease-in forwards";
    setTimeout(() => {
        truck.style.left = "300%;"
        truck.style.animation = "truckGoIn 2s ease-out forwards";
        boxGridSlots.forEach(slot => {
            slot.classList.remove("smallbox");
            slot.classList.remove("mediumbox1");
            slot.classList.remove("mediumbox2");
            slot.classList.remove("largebox");
            slot.classList.remove("notFree");
            slot.firstChild.src = "";
            if (boxSelected != "none") {
                boxGridSlots.forEach(slot => {
                    slot.classList.add("selectMode");
                })
            }
        })
    }, 1500);
}





startGame()