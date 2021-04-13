import { startGrasePole } from './greasePoleClimber/greasePoleClimber';
import { startVillageRunner } from './villageRunner/villageRunner'


document.getElementById("greasePoleClimber").onclick = function(){
    startGrasePole();
    hideButtons();
}

document.getElementById("villageRunner").onclick = function(){
    startVillageRunner();
    hideButtons();
}

function hideButtons() {
    let buttons = document.getElementById("selectorBtnGroup");
    buttons.style.display = "none";
}

