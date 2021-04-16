import { startGrasePole } from './greasePoleClimber/greasePoleClimber';
import { startVillageRunner } from './villageRunner/villageRunner';
import { startPotBreaker } from './potBreaker/potBreaker';

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

function hideButtons() {
    let buttons = document.getElementById("selectorBtnGroup");
    buttons.style.display = "none";
}

