import { startGrasePole } from './greasePoleClimber/greasePoleClimber';
import { startVillageRunner } from './villageRunner/villageRunner';
import { startPotBreaker } from './potBreaker/potBreaker';
import { startMarkEye } from './markEye/markEye';

document.getElementById("greasePoleClimber").onclick = function(){
    startGrasePole();
    hideButtons();
}

document.getElementById("villageRunner").onclick = function(){
    startVillageRunner();
    hideButtons();
}

document.getElementById("potBreaker").onclick = function(){
    startPotBreaker();
    hideButtons();
}

document.getElementById("markEye").onclick = function(){
    startMarkEye()
    hideButtons();
}

function hideButtons() {
    let buttons = document.getElementById("selectorBtnGroup");
    buttons.style.display = "none";
}

