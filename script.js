
let taskInput  = document.getElementById("inputTask");
let taskAdded = document.querySelectorAll("p.taskAdded");
let taskXP = document.querySelectorAll("p.taskXP");
let currentLVL  = document.getElementById("currentLVL");
let addNewTask = document.getElementById("newTaskButton");
let tasksAddedList = document.getElementById("tasksAddedList");

//Modal vars
let modal = document.getElementById("modalNewTask");
let blurBackground = document.getElementById("blurBackground")
let closeModal = document.getElementById("closeButton");
let cancelModal = document.getElementById("cancelButton");
let createButton = document.getElementById("createButton");
let createTaskName = document.getElementById("taskName");
let createTaskXP = document.getElementById("amountXp");


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

//Closes modal with X
closeModal.addEventListener("click", closeModal =>{

    modal.classList.replace("shown", "hidden");
    blurBackground.classList.replace("shown", "hidden");

})

//Closes modal with 'cancel' button
cancelModal.addEventListener("click", closeModal =>{

    modal.classList.replace("shown", "hidden");
    blurBackground.classList.replace("shown", "hidden");

})


//Create task and add it to task list.
createButton.addEventListener("click", createTask =>{


    let nuevaTask = document.createElement("li");
    let pTask = document.createElement("p");
    let spanPTask = document.createElement("span");

    //Modify text of vars with text inputted by user. Add vars their respective classes for styling.
    pTask.innerHTML = createTaskName.value;
    spanPTask.innerText = "+" + createTaskXP.value + "xp";
    pTask.classList.add("bodyText");
    spanPTask.classList.add("favouriteColor");

    //Add vars created to their corresponding fathers, pTask and spanPTask are brothers so 
    //Justify-content picks up both. If span appended to p wont work. 
    tasksAddedList.appendChild(nuevaTask);
    nuevaTask.appendChild(pTask);
    nuevaTask.appendChild(spanPTask);
})