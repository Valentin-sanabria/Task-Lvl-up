
let taskInput  = document.getElementById("inputTask");
let taskAdded = document.querySelectorAll("p.taskAdded");
let taskXP = document.querySelectorAll("p.taskXP");
let currentLVL  = document.getElementById("currentLVL");

totalXP = 0;
let totalLevelXP = 727;
let currentXP = document.getElementById("totalXP");
let i = 0;


//Move task from input to output task list.
taskInput.addEventListener("keypress", function(x) {

    if (x.key === 'Enter'){

        taskAdded[i].innerHTML = "• " + taskInput.value;
        console.log("pepe");
        
        taskInput.value = "";
        addXP( (taskXP[i].innerHTML).slice(2,-2) );
        i++;
    }

    //Reset counter so it modifies first task once again.
    if ( i === 4) {

        i = 0;
    }

})

function addXP(taskXP) {
    
    totalXP = totalXP + parseInt(taskXP);
    currentXP.innerHTML = totalXP + " / " + totalLevelXP;

    checkLVLUP();
}

function checkLVLUP() {

    if (totalXP >= totalLevelXP) {

        totalXP = 0;
        totalLevelXP = Math.round(totalLevelXP * 1.26);
        
        currentLVL.innerHTML = parseInt(currentLVL.innerHTML) + 1; 
        currentXP.innerHTML = totalXP + " / " + totalLevelXP;
    
    }
                                       
}