
let taskInput  = document.getElementById("inputTask");
let taskAdded = document.querySelectorAll("p.taskAdded");
let taskXP = document.querySelectorAll("p.taskXP");
let currentLVL  = document.getElementById("currentLVL");
let addNewTask = document.getElementById("newTaskButton")
let modal = document.getElementById("modalNewTask");
let blurBackground = document.getElementById("blurBackground")
let closeModal = document.getElementById("closeButton");


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
        //Call function and send sliced string for parsing. For ex: "+15xp" → "15"
        addXP( (taskXP[i].innerHTML).slice(2,-2) );
        i++;
    }

    //Reset counter so it modifies first task once again.
    if ( i === 4) {

        i = 0;
    }

})

//Add xp to progressBar and changes number by adding parsed taskXP to totalXP.
function addXP(taskXP) {
    
    totalXP = totalXP + parseInt(taskXP);
    currentXP.innerHTML = totalXP + " / " + totalLevelXP;

    checkLVLUP();
}

//Checks totalXP has not surpassed the amount needed to level up. If it has, change output to match accordingly.
function checkLVLUP() {

    if (totalXP >= totalLevelXP) {

        totalXP = 0;
        totalLevelXP = Math.round(totalLevelXP * 1.26);
        
        currentLVL.innerHTML = parseInt(currentLVL.innerHTML) + 1; 
        currentXP.innerHTML = totalXP + " / " + totalLevelXP;
    
    }
                                       
}

//Opens modal to configure and add a new task.
addNewTask.addEventListener("click", openModal =>{

    modal.classList.replace("hidden", "shown");
    blurBackground.classList.replace("hidden", "shown");
})

//Closes modal
closeModal.addEventListener("click", closeModal =>{

    modal.classList.replace("shown", "hidden");
    blurBackground.classList.replace("shown", "hidden");

})