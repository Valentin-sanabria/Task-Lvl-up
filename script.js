//Main page vars
let taskInput  = document.getElementById("inputTask");
let taskAdded = document.querySelectorAll("p.taskAdded");
let amountTimesHs = document.querySelectorAll("input.amountTimes")
let taskXP = document.querySelectorAll("span.taskXP");
let currentLVL  = document.getElementById("currentLVL");
let addNewTask = document.getElementById("newTaskButton");
let tasksAddedList = document.getElementById("tasksAddedList");
let confirmTasks = document.getElementById("confirmTasks");
let ulDoneToday = document.getElementById("taskDoneToday");
let ulWeekTasks = document.getElementById("ulWeekTasks");
let deleteIcon = document.querySelectorAll(".deleteIcon");
let clickableTask = document.querySelectorAll("#taskDoneToday li");
let allWeeklis = [];
let tasksArrayRecommendation = JSON.parse( localStorage.getItem("taskArrayrecommendation") );
if (tasksArrayRecommendation === null){
    console.log("tasks creadas vacio");
    tasksArrayRecommendation = [];
}
let taskCreatedListStorage = JSON.parse( localStorage.getItem("task") );
if (taskCreatedListStorage === null){
    console.log("task vacio");
    taskCreatedListStorage = [];
}
let suggestionsDiv = document.getElementById("suggestions");

//Storage

//Modal vars
let modal = document.getElementById("modalNewTask");
let blurBackground = document.getElementById("blurBackground")
let closeModal = document.getElementById("closeButton");
let cancelModal = document.getElementById("cancelButton");
let createButton = document.getElementById("createButton");
let createTaskName = document.getElementById("taskName");
let createTaskXP = document.getElementById("amountXp");
let checkboxTimehs = document.getElementById("checkboxModal");
let taskBaseXP = 0;
let unconfirmedXPFromArray = [];
let unconfirmedTotalXP = 0;
let totalXP = 0;
let totalLevelXP = 727;
let currentXP = document.getElementById("totalXP");
let i = 0;
let j = 0;

//        XP AND TODAY FUNCTIONS

//Move task from input to today list.
taskInput.addEventListener("keypress", function(x) {
    if (x.key === 'Enter'){
        let newTask = document.createElement("li");
        ulDoneToday.append(newTask);
        newTask.outerHTML = taskChosenInfo;
        taskInput.value = "";
    }
})

//Drop-down suggestions based on user's input.
taskInput.addEventListener("keyup", popsuggestion => {
    let coincidence = [];
        if((taskInput.value).length != 0){
            suggestionsDiv.innerHTML = "";
            //Filter all tasks created by making sure that, if both are lowercase, input and task recomendation are written with same letters.
            coincidence = tasksArrayRecommendation.filter( task =>
            task.taskName.toLowerCase().includes(taskInput.value.toLowerCase())
            )
            let allSugestions = coincidence.map( (item) => {
                return `<li class="bodyText">${item.taskName}</li>`;
            }).join("");
            suggestionsDiv.innerHTML = allSugestions;
            for (var i = 0; i < suggestionsDiv.children.length; i++) {
                suggestionsDiv.children[i].setAttribute('onclick', "fillInput("+JSON.stringify(coincidence[i])+")");
            }
        }
        if((taskInput.value).length === 0) {
            suggestionsDiv.innerHTML = "";
        }
})

//Auto-fill Today list based on the suggestion the user clicked.
function fillInput(taskChosenInfo) {
    taskInput.value = "";
    let newTask = document.createElement("li");
    ulDoneToday.append(newTask);
    newTask.outerHTML = '<li> <p class="taskAdded bodyText"> •'+taskChosenInfo.taskName+'</p> <input class="amountTimes bodyText" type="number" min="1" value="1"> <span class="taskXP favouriteColor">+'+taskChosenInfo.xpReward+'xp</span> <img class="deleteIcon hidePRO" src="imgs/deleteIcon.png" style="display:none" alt="">  </li>';    ;
    clickableTask = document.querySelectorAll("#taskDoneToday li");
    deleteIcon = document.querySelectorAll(".deleteIcon");

    assignDisplayDeleteIconEvent();
    assignRemoveElementWhenClickEvent();
}

//Checks totalXP has not surpassed the amount needed to level up. If it has, change output to match accordingly.
function checkLVLUP() {
    if (totalXP >= totalLevelXP) {
        mediumLVLUP();
        currentLVL.innerHTML = parseInt(currentLVL.innerHTML) + 1;
        currentXP.innerHTML = totalXP + " / " + totalLevelXP;
    }
}

// Difficulty settings.
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

// Delete today tasks
function assignRemoveElementWhenClickEvent() {
    deleteIcon.forEach(element => {
        if(element.getAttribute("AlreadyHasClickListenerForDelete") !== "true") {
            element.addEventListener("click", function() {
                element.parentElement.classList.add("hidePRO");
                setTimeout(() => {
                    element.parentElement.remove()
                }, 300);
            })

            element.setAttribute("AlreadyHasClickListenerForDelete", "true");
        }
    });
}

// Show and hide delete icon
function assignDisplayDeleteIconEvent() {
    
    clickableTask.forEach(element => {
        if(element.getAttribute("AlreadyHasClickListenerForButtonDisplay") !== "true") {
            element.addEventListener("click", function(element){
            if(String(element.target).includes("[object HTMLLIElement]")) {
                if(element.target.childNodes[7] !== undefined){
                    if(element.target.childNodes[7].classList.contains("hidePRO")) {
                            element.target.childNodes[7].classList.remove("hidePRO");
                            element.target.childNodes[7].style.display = "";
                            element.target.childNodes[7].classList.add("showPRO");
                    } else if(element.target.childNodes[7].classList.contains("showPRO")) {
                        element.target.childNodes[7].classList.remove("showPRO");
                        element.target.childNodes[7].classList.add("hidePRO");
                        setTimeout(() => {
                            element.target.childNodes[7].style.display = "none";
                            }, 300);
                        }
                    }
                }
            })
        }

        element.setAttribute("AlreadyHasClickListenerForButtonDisplay", "true");
    });
}


//            MODAL FUNCTIONS           

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

    if( createTaskName.value != '' && createTaskXP.value != ''){
        let inputValidation = checkInput();
        if (inputValidation == false){
            return;
        }
        let nuevaTask = document.createElement("li");
        let pTask = document.createElement("p");
        let spanPTask = document.createElement("span");
        if(checkboxTimehs.checked) {
            hsOrTime = "session";
        }
        if(!checkboxTimehs.checked) {
            hsOrTime = "hours";
        }

        //Modify text of vars with text inputted by user. Add vars their respective classes for styling.
        const taskCreated = new taskUserCreated(createTaskName.value, hsOrTime, createTaskXP.value);
        pTask.innerHTML = taskCreated.taskName;
        spanPTask.innerText = "+" + taskCreated.xpReward + "xp";
        pTask.classList.add("bodyText");
        spanPTask.classList.add("favouriteColor");

        //Add vars created to their corresponding fathers, pTask and spanPTask are brothers so
        //Justify-content picks up both. If span appended to p wont work.
        tasksAddedList.appendChild(nuevaTask);
        nuevaTask.appendChild(pTask);
        nuevaTask.appendChild(spanPTask);

        //Add task created to tasks array to include in future input suggestions.
        tasksArrayRecommendation.push(taskCreated);
        taskCreatedListStorage.push(nuevaTask.outerHTML);
        localStorage.setItem("taskArrayrecommendation", JSON.stringify(tasksArrayRecommendation));
        localStorage.setItem("task", JSON.stringify(taskCreatedListStorage));
    }
})

//Object structure for each user task.
function taskUserCreated(name, hstimes, xp) {
    this.taskName = name;
    this.hsOrTime = hstimes;
    this.xpReward = xp;
}

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


//        THIS WEEK/MONTH FUNCTIONS

//Send today tasks to this week task list
confirmTasks.addEventListener("click", todayToWeekly => {
    let allTasks = [];
    let quantityAppareance = 0;
    let itRepeated = false;
    let pTaskWeek = document.querySelectorAll("ul#ulWeekTasks li p.taskAdded");
    let pTaskToday = document.querySelectorAll("ul#taskDoneToday li p.taskAdded");
    let timesTaskWeek = document.querySelectorAll("ul#ulWeekTasks li input.amountTimes");

    timesTaskWeek.forEach(element => {
        inputToText = document.createElement("p");
        inputToText.classList.add("bodyText");
        inputToText.innerText = element.value + " times.";
        if (parseInt(element.value) == 1){
            inputToText.innerText = element.value + " time.";
        }
        element.replaceWith(inputToText);
    });

    //Check duplicates
    for(let j of pTaskToday){
        for(let k of pTaskWeek){
            if ( j.innerHTML == k.innerHTML){
                quantityAppareance++;
            }
            if ( k.parentElement.children[1].innerHTML == ""){
                k.parentElement.children[1].innerHTML == "1 time."
            }
            //Update amount of times/hours the activity was done and how much XP it has given in total.
            if (quantityAppareance > 0 &&  j.innerHTML == k.innerHTML ){
                k.parentElement.children[1].innerHTML = (parseInt(k.parentElement.children[1].innerText) + parseInt(j.parentElement.children[1].value)) + " times.";
                k.parentElement.children[2].innerHTML = "+" + ( parseInt(j.parentElement.children[2].innerHTML) * parseInt(k.parentElement.children[1].innerHTML) ) + "xp"; 
            }
            //Remove duplicate.
            if (quantityAppareance > 1 &&  j.innerHTML == k.innerHTML ){
                k.parentElement.remove();
            }
        }
        if ( quantityAppareance === 0 ){
            newUniqueTask = j.parentElement.cloneNode(true);
            if(newUniqueTask.children.length !== 3) {
                newUniqueTask.children[3].remove();
            }
            ulWeekTasks.append(newUniqueTask);
        }
        quantityAppareance = 0;
    }
    allWeeklis = document.querySelectorAll("ul#taskDoneWeek li span.taskXP");
    saveWeekProgress();
    addXP(allWeeklis);
})


//Add xp to progressBar and changes number by adding parsed taskXP to totalXP.
function addXP(li) {
    li.forEach(function sumXP() {
        currentXP.innerHTML = totalXP + " / " + totalLevelXP;
        checkLVLUP();
    })
}

var amountOfTasks = "";
var wholeWeekList = [];
function saveWeekProgress() {
    if(ulWeekTasks !== null) {
        amountOfTasks = ulWeekTasks.children.length;
        for (var p=0; p<amountOfTasks ; p++){
            wholeWeekList[p] = ulWeekTasks.children[p].outerHTML;
        }
        //Make the updated array a string and automatically save it on localStorage
        localStorage.setItem("listOfWeek", JSON.stringify(wholeWeekList) );
    }
}

var parsedWeekList = [];
var liWeek = [];
function loadWeekProgress() {
    parsedWeekList = JSON.parse( localStorage.getItem("listOfWeek") );
    if(parsedWeekList !== null){
        for (var p=0; p<parsedWeekList.length ; p++){
            liWeek[p] = document.createElement("li");
            ulWeekTasks.append(liWeek[p]);
            liWeek[p].outerHTML = parsedWeekList[p];
        }
    }
}

var parsedTaskList = [];
var liTasks = [];
function loadtasksArrayRecommendation() {
    parsedTaskList = JSON.parse( localStorage.getItem("task") );
    if(parsedTaskList !== null){
        for (var p=0; p<parsedTaskList.length ; p++){
            liTasks[p] = document.createElement("li");
            tasksAddedList.append(liTasks[p]);
            liTasks[p].outerHTML = parsedTaskList[p];
        }
    }
}
loadtasksArrayRecommendation();
loadWeekProgress();