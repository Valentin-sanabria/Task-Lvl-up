
//Main page vars
let taskInput  = document.getElementById("inputTask");
let taskAdded = document.querySelectorAll("p.taskAdded");
let taskXP = document.querySelectorAll("span.taskXP");
let currentLVL  = document.getElementById("currentLVL");
let addNewTask = document.getElementById("newTaskButton");
let tasksAddedList = document.getElementById("tasksAddedList");
let confirmTasks = document.getElementById("confirmTasks");
let ulDoneToday = document.getElementById("taskDoneToday");
let ulDoneWeek = document.getElementById("taskDoneWeek")
let divWeekTasks = document.getElementById("divWeekTasks");

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
        addXP( (taskXP[i].innerHTML).slice(1,-2) );
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

        mediumLVLUP();
        
        currentLVL.innerHTML = parseInt(currentLVL.innerHTML) + 1; 
        currentXP.innerHTML = totalXP + " / " + totalLevelXP;
    
    }
                                       
}

function easyLVLUP() {

    totalXP = totalXP-100;
    totalLevelXP = Math.round(totalLevelXP * 1.22);

}

function mediumLVLUP() {

    totalXP = totalXP-300;
    totalLevelXP = Math.round(totalLevelXP * 1.22);

}

function hardLVLUP() {

    totalXP = totalXP-600;
    totalLevelXP = Math.round(totalLevelXP * 1.26);

}

//Opens modal to configure and add a new task.
addNewTask.addEventListener("click", openModal =>{

    modal.classList.replace("hidden", "shown");
    blurBackground.classList.replace("hidden", "shown");
})

//Closes modal with X and with 'cancel' (diff functions)
closeModal.addEventListener("click", closeModal =>{

    modal.classList.replace("shown", "hidden");
    blurBackground.classList.replace("shown", "hidden");

})
cancelModal.addEventListener("click", closeModal =>{

    modal.classList.replace("shown", "hidden");
    blurBackground.classList.replace("shown", "hidden");

})


//Create task and add it to task list.
createButton.addEventListener("click", createTask =>{

    //Check inputs arent empty.
    if( createTaskName.value != '' && createTaskXP.value != ''){

        let inputValidation = checkInput();
        if (inputValidation == false){
            return;
        }

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

    }
  
})

//Check input respects input desired.
function checkInput(){

    //Does not contain a-z|A-Z|spaces(\s) OR contains numbers(\d).
    if ( /^[a-zA-Z\s]*$/.test(createTaskName.value) == false ||  /\d/.test(createTaskName.value) == true){
       alert("Task names can not contain anything that is not a letter or a whitespace.");
       return false;
    }
    //Contains anything that is NOT a number.
    else if ( /\D/.test(createTaskXP.value) == true ){
        alert("Task XP rewards can not contain anything that is not a number.")
        return false;
     }
    
    else {
        return true;
    }
}

//Send today tasks to this week task list
confirmTasks.addEventListener("click", todayToWeekly => {

    ulDoneWeek = ulDoneToday.cloneNode(true);
    ulDoneWeek.id = "taskDoneWeek";
    divWeekTasks.appendChild(ulDoneWeek);

    let allTasks = [];
    let quantityAppareance = 0;
    let itRepeated = false;
    let pTaskWeek = document.querySelectorAll("ul#taskDoneWeek li p.taskAdded");
    let timesTaskWeek = document.querySelectorAll("ul#taskDoneWeek li span.amountTimes");


    for(let j of pTaskWeek){

        allTasks.push(j);

        for(let k of allTasks){

            if ( j.innerHTML == k.innerHTML){

                quantityAppareance++;
                console.log(j.innerHTML +" se repitio " + quantityAppareance +"veces.");
            }

            if (quantityAppareance > 1){

                console.log(j.innerHTML + " esta repetida.");
                itRepeated =true;
            }

            if (itRepeated == true) {

                j.innerHTML = "repetido.";
            }

            itRepeated = false;
        }

        quantityAppareance = 0;
    }


})