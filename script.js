//Main page vars
let taskInput  = document.getElementById("inputTask");
let taskAdded = document.querySelectorAll("p.taskAdded");
let amountTimesHs = document.querySelectorAll("input.amountTimes")
let taskXP = document.querySelectorAll("span.taskXP");
let currentLVL  = document.getElementById("currentLVL");
let addNewTask = document.getElementById("newTaskButton");
let deleteCreatedTask = document.getElementById("deleteTaskButton");
let tasksAddedList = document.getElementById("tasksAddedList");
let confirmTasks = document.getElementById("confirmTasks");
let ulDoneToday = document.getElementById("taskDoneToday");
let ulWeekTasks = document.getElementById("ulWeekTasks");
let ulMonthTasks = document.getElementById("ulMonthTasks");
let ulYearTasks = document.getElementById("ulYearTasks");
let deleteIcon = document.querySelectorAll(".deleteIcon");
let clickableTask = document.querySelectorAll("#taskDoneToday li");
let allWeeklis = [];
let tasksArrayRecommendation = JSON.parse( localStorage.getItem("taskArrayrecommendation") );
if (tasksArrayRecommendation === null){
    tasksArrayRecommendation = [];
}
let allTasksDone = JSON.parse(localStorage.getItem("allTasksDone"));
if (allTasksDone === null){
    allTasksDone = [[]];
}
let taskCreatedListStorage = JSON.parse( localStorage.getItem("task") );
if (taskCreatedListStorage === null){
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

//Add XP from all tasks done in this year
let totalSumXP = 0;
if(isNaN(parseInt(currentXP.innerText))){
    totalSumXP = 0;
} else {
    totalSumXP = parseInt(currentXP.innerText);
}
function addAllTasksXP(taskCompleted) {
    totalSumXP = totalSumXP + parseInt(taskCompleted.substring(taskCompleted.indexOf("+")+1,taskCompleted.indexOf("x", taskCompleted.indexOf("+") )));
    currentXP.innerText = totalSumXP;
    checkLVLUP()
}

//Checks totalXP has not surpassed the amount needed to level up. If it has, change output to match accordingly.
function checkLVLUP() {
    if (parseInt(currentXP.innerText) >= parseInt(xpNeededForLvlUp.innerText)) {
        LVLUP();
        currentLVL.innerHTML = parseInt(currentLVL.innerHTML) + 1;
        checkLVLUP();
    }
    localStorage.setItem("currentXP", JSON.stringify(currentXP.innerText));
}

//Load XP when opening app
function loadCurrentXP() {
    if ( isNaN(parseInt(JSON.parse(localStorage.getItem("currentXP")))) ){
        currentXP.innerText = 0;
    }
    else {
        currentXP.innerText = JSON.parse(localStorage.getItem("currentXP"));
        checkLVLUP();
    }
}

// Difficulty settings.
function LVLUP() {
    if(totalLevelXP > 15000){
        totalLevelXP = Math.round(totalLevelXP * 1.1);
    } else if (totalLevelXP > 10000){
        totalLevelXP = Math.round(totalLevelXP * 1.22);
    } else {
        totalLevelXP = Math.round(totalLevelXP * 1.46);
    }
    currentXP.innerText = parseInt(currentXP.innerText) - parseInt(xpNeededForLvlUp.innerText);
    xpNeededForLvlUp.innerText = totalLevelXP;

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
        if(hsOrTime === "session") {
            spanPTask.innerText = "+" + taskCreated.xpReward + "xp";
        }
        if(hsOrTime ===  "hours") {
            spanPTask.innerText = "+" + (taskCreated.xpReward) + "xp";
        }
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
        console.log(taskCreatedListStorage);
        localStorage.setItem("taskArrayrecommendation", JSON.stringify(tasksArrayRecommendation));
        localStorage.setItem("task", JSON.stringify(taskCreatedListStorage));
    }
        //Add eventListener to new task in UL
        alltasksLI = document.querySelectorAll("#tasksAddedList li");
        alltasksLI.forEach(task => {
            task.addEventListener("click", deleteTask);
        })
})

//Object structure for each user task.
function taskUserCreated(name, hstimes, xp, creationDate, amount) {
    this.taskName = name;
    this.hsOrTime = hstimes;
    this.xpReward = xp;
    this.amountTimesHs = amount;
    this.creationDate = creationDate;
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
        if(JSON.parse(localStorage.getItem("task")) !== null){
            let temporaryTaskArray = JSON.parse(localStorage.getItem("task"));
            for (const task of temporaryTaskArray) {
                console.log(task.substring(task.indexOf('">')+2, task.indexOf('</p')));
                if ( createTaskName.value === task.substring(task.indexOf('">')+2, task.indexOf('</p')) ) {
                    alert("There's a task with that name already. Avoid duplicate names.")
                    return false;
                }
            }
        return true;
    }}
}

//        THIS WEEK/MONTH FUNCTIONS


//ESTO SE QUEDA ASI, PQ SIEMPRE TIENE QUE IR DE TODAY A WEEKLY, DE HECHO HAY QUE AGREGAR PARA QUE TAMBIEN SE SUME
//AUTOMATICAMENTE EN ULTODAY Y ULYEAR PQ LO UNICO QUE VA A HACER EL FILTER ES SACARLAS DE TODAY Y DE THIS WEEK
//POR ENDE EL FILTER SE USA EN LA FUNCION LOAD. ESA INFO QUE TRAEMOS DEL LOCALSTORAGE ES LA QUE HAY QUE POSTERIORMENTE
//FILTRAR Y ORDENAR. HAY QUE ASEGURAR QUE CUANDO GUARDAMOS EN LOCALSTORAGE QUE SE INCLUYA LA FECHA DENTRO DEL STRING
//CUANDO LAS TASKS SON CREADAS NUEVAS DESDE 0 ES LOGICO QUE LA FECHA COINCIDE CON LA DE HOY, LA DE ESTA SEMANA, Y LA DE ESTE AÑO.
//PERO NO ES LOGICO QUE COINCIDAN CUANDO LA TASKS YA FUE CREADA PREVIAMENTE.

//Send today tasks to this week task list
confirmTasks.addEventListener("click", todayToWeekly2 => {
    todayToWeekly()
})

function outerHtmlToObject(outerHtmlString) {
    let taskName = outerHtmlString.substring(outerHtmlString.indexOf("•")+1,outerHtmlString.indexOf("<", outerHtmlString.indexOf("•") ));
    let taskXP = outerHtmlString.substring(outerHtmlString.indexOf("+")+1,outerHtmlString.indexOf("<", outerHtmlString.indexOf("+") ));

    let taskCreationDate = getTodayDate();
    const taskAsObject = new taskUserCreated();

    Object.defineProperties(taskAsObject, {
        taskName: {
            value: taskName
        },
        xpReward: {
            value: taskXP
        },
        creationDate: {
            value: taskCreationDate
        }
    });

    return taskAsObject
}

function checkIfTaskHasBeenDoneAlready(todayTaskLI) {
    let arrayLength = allTasksDone.length
    for(let i=0;i<arrayLength;i++){
        console.log(allTasksDone);
        if(allTasksDone[0] == "") {
            let newTaskArray = [todayTaskLI];
            allTasksDone[0] = newTaskArray;
            console.log(allTasksDone);
        }
        else if(allTasksDone[i][0].taskName.includes(todayTaskLI.taskName)) {
            for(let j=0;j < todayTaskLI.amountTimesHs;j++){
                allTasksDone[i].push(todayTaskLI);
            }

            break;
        }
        else if(!allTasksDone[i][0].taskName.includes(todayTaskLI.taskName) && i === allTasksDone.length - 1) {
            let newTaskArray = [todayTaskLI];
            allTasksDone.push(newTaskArray);
            break;
        }
    }
    localStorage.setItem("allTasksDone", JSON.stringify(allTasksDone));
}



function todayToWeekly() {
    let quantityAppareance = 0;
    let pTaskWeek = document.querySelectorAll("ul#ulWeekTasks li p.taskAdded");
    let pTaskToday = document.querySelectorAll("ul#taskDoneToday li");
    let timesTaskWeek = document.querySelectorAll("ul#ulWeekTasks li input.amountTimes");
    console.log(pTaskToday);
    let taskOuterHTML
    pTaskToday.forEach( task => {
        if(task.outerHTML.includes('min="1" value="1"')){
            taskOuterHTML = task.outerHTML.replace('min="1" value="1"', 'min="1" value="'+ task.children[1].value + '"')
            console.log("EL TASK CON VALUE ACTUALIZADO ES: "+taskOuterHTML)
        }
        checkIfTaskHasBeenDoneAlready(outerHtmlToObject(taskOuterHTML));
    } )
    
  /*
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
            currentDate = document.createElement("p");
            currentDate.innerText = getTodayDate();
            currentDate.classList.add("hide");
            newUniqueTask.append(currentDate);
            ulWeekTasks.append(newUniqueTask);
            outerHtmlToObject(newUniqueTask.outerHTML);

        }
        quantityAppareance = 0;
    } */
    allWeeklis = document.querySelectorAll("ul#taskDoneWeek li span.taskXP");
    timesTaskWeek = document.querySelectorAll("ul#ulWeekTasks li input.amountTimes");
    timesTaskWeek.forEach(element => {
        inputToText = document.createElement("p");
        inputToText.classList.add("bodyText");
        inputToText.innerText = element.value + " times.";
        if (parseInt(element.value) == 1){
            inputToText.innerText = element.value + " time.";
        }
        element.replaceWith(inputToText);
    });

    saveWeekProgress();
    addXP(allWeeklis);
    todayToMonthly();
    todayToYearly();
}

//Send today tasks to this month task list
function todayToMonthly() {
    let quantityAppareance = 0;
    let pTaskMonth = document.querySelectorAll("ul#ulMonthTasks li p.taskAdded");
    let pTaskToday = document.querySelectorAll("ul#taskDoneToday li p.taskAdded");

    //Check duplicates
    for(let j of pTaskToday){
        for(let k of pTaskMonth){
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
            currentDate = document.createElement("p");
            currentDate.innerText = getTodayDate();
            currentDate.classList.add("hide");
            newUniqueTask.append(currentDate);
            ulMonthTasks.append(newUniqueTask);

        }
        quantityAppareance = 0;
    }

    let timesTaskMonth = document.querySelectorAll("ul#ulMonthTasks li input.amountTimes");
    timesTaskMonth.forEach(element => {
        inputToText = document.createElement("p");
        inputToText.classList.add("bodyText");
        inputToText.innerText = element.value + " times.";
        if (parseInt(element.value) == 1){
            inputToText.innerText = element.value + " time.";
        }
        element.replaceWith(inputToText);
    });
    saveWeekProgress();
}

function todayToYearly() {
    let quantityAppareance = 0;
    let pTaskYear = document.querySelectorAll("ul#ulYearTasks li p.taskAdded");
    let pTaskToday = document.querySelectorAll("ul#taskDoneToday li p.taskAdded");

    //Check duplicates
    for(let j of pTaskToday){
        for(let k of pTaskYear){
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
            let currentDate = document.createElement("p");
            currentDate.innerText = "05/03/2023";
            currentDate.classList.add("hide");
            newUniqueTask.append(currentDate);
            ulYearTasks.append(newUniqueTask);
            

        }
        quantityAppareance = 0;
    }
    let timesTaskYear = document.querySelectorAll("ul#ulYearTasks li input.amountTimes");
    timesTaskYear.forEach(element => {
        inputToText = document.createElement("p");
        inputToText.classList.add("bodyText");
        inputToText.innerText = element.value + " times.";
        if (parseInt(element.value) == 1){
            inputToText.innerText = element.value + " time.";
        }
        element.parentElement.children[2].innerHTML = "+" + ( parseInt(element.parentElement.children[2].innerHTML) * parseInt(element.parentElement.children[1].value) ) + "xp";
        element.replaceWith(inputToText);
    });

    let allTasksThisFar = document.querySelectorAll("ul#ulYearTasks li");
    allTasksThisFar.forEach(element => {
        // element.parentElement.children[2].innerHTML = "+" + ( parseInt(element.parentElement.children[2].innerHTML) * parseInt(element.parentElement.children[1].value) ) + "xp";
        addAllTasksXP(element.children[2].innerHTML);
    });
    totalSumXP = 0;
    saveWeekProgress();
}

//Add xp to progressBar and changes number by adding parsed taskXP to totalXP.
function addXP(li) {
    li.forEach(function sumXP() {
        currentXP.innerHTML = totalXP + " / " + totalLevelXP;
        checkLVLUP();
    })
}


var amountOfTasks;
var allTasksDoneEver = [];
function saveWeekProgress() {
    allTasksDoneEver = JSON.parse(localStorage.getItem("listOfAllTasksDoneEver"));
    if(allTasksDoneEver === null) {
        allTasksDoneEver = [];
    }
    if(allTasksDoneEver !== null) {
        amountOfTasks = ulYearTasks.children.length;
        for (var p=0; p<amountOfTasks ; p++){
            allTasksDoneEver[p] = (ulYearTasks.children[p].outerHTML);
            
        }
        //Make the updated array a string and automatically save it on localStorage
        localStorage.setItem("listOfAllTasksDoneEver", JSON.stringify(allTasksDoneEver) );
    }
}

var parsedWeekList = [];
var liWeek = [];
function loadWeekProgress() {
    parsedWeekList = JSON.parse( localStorage.getItem("allTasksDone") );

    if(parsedWeekList !== null){
        parsedWeekList.forEach( task => {
            let newElement = document.createElement("li") 
            newElement.innerHTML = '<p class="taskAdded bodyText"> •'+task[0].taskName+'</p> <p class="taskAdded bodyText">'+task.length+' times. </p> <span class="taskXP favouriteColor">+'+(task[0].xpReward * task.length)+'xp</span>'
    
            if( isThisWeek(task[0].creationDate) ) {
                ulWeekTasks.append(newElement.cloneNode(true)); 
                ulMonthTasks.append(newElement.cloneNode(true)); 
                ulYearTasks.append(newElement.cloneNode(true)); 
            } else if ( isThisMonth(task[0].creationDate) )  {
                ulMonthTasks.append(newElement.cloneNode(true)); 
                ulYearTasks.append(newElement.cloneNode(true)); 
            } else {
                ulYearTasks.append(newElement.cloneNode(true)); 
            }
        })
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



function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    return today = dd + '/' + mm + '/' + yyyy;
}

function outerHtmlToObject(outerHtmlString) {
    let taskName = outerHtmlString.substring(outerHtmlString.indexOf("•")+1,outerHtmlString.indexOf("<", outerHtmlString.indexOf("•") ));
    let taskXP = outerHtmlString.substring(outerHtmlString.indexOf("+")+1,outerHtmlString.indexOf("x", outerHtmlString.indexOf("+") ));
    console.log(outerHtmlString.indexOf("+")+1,outerHtmlString.indexOf("<", outerHtmlString.indexOf("+")))
    let taskCreationDate = getTodayDate();
    let taskAmountTimesHs = outerHtmlString.substring(outerHtmlString.indexOf('min="1" value="')+15, outerHtmlString.indexOf('min="1" value="')+16);
    const taskAsObject = new taskUserCreated();

    Object.defineProperties(taskAsObject, {
        taskName: {
            value: taskName
        },
        xpReward: {
            value: taskXP
        },
        creationDate: {
            value: taskCreationDate
        },
        amountTimesHs: {
            value: taskAmountTimesHs
        }
    });
    return taskAsObject
}


function isThisWeek(date) {
    let thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    var dd = String(thisWeek.getDate()).padStart(2, '0');
    var mm = String(thisWeek.getMonth() + 1).padStart(2, '0');
    var yyyy = thisWeek.getFullYear();
    thisWeek = mm + '/' + dd + '/' + yyyy;

    if (date > thisWeek ) {
        return true;
    } else
    return false;
}

function isThisMonth(date) {
    let thisMonth = new Date();
    let mm = String(thisMonth.getMonth() + 1).padStart(2, '0');
    let substring = date.substring(3,5);

    if (substring === mm ) {
        return true;
    } else
    return false;
}

            //CHECK IF SOMETHING IS TIME TASK OR SESSION TASK. WIP HAY QUE SEGUIRLO
            // let foundTask;
            // let parsedJSON;
            // console.log(JSON.parse(localStorage.getItem("taskArrayrecommendation")));
            // parsedJSON = JSON.parse(localStorage.getItem("taskArrayrecommendation"));
            // foundTask = parsedJSON.filter(task =>{
            //     console.log("el localstorage es: ", task.taskName);
            //     console.log("el nombre es: ", k.parentElement.children[0].innerText);
            //     return task.taskName === k.parentElement.children[0].innerText; //ACA HACER SUBSTRING PORQ SE INCLUYE EL • EN EL STRING Y NO SON ===
            //     // if(task.taskName === k.parentElement.children[0].innerText) {
            //     //     return task
            //     // }
            //     }
            // )
            // console.log(foundTask);
            // console.log(foundTask[0], " ES SESSION");
            // if(foundTask[0].hsOrTime === "session" ) {
            //     console.log(foundTask);
            //     console.log(foundTask[0], " ES SESSION");
            // } else if (filter.hsOrTime === time) {
            //     console.log(foundTask);
            //     console.log(foundTask[0], " ES TIME");
            // }


            /*
            IDEAS PARA OPTIMIZAR EL CODIGO?
            NO ES NECESARIO CREARLO UNA VEZ EN CADA DIV, DEBERIA DE PODER CREARLO SOLO EN EL DIV SEMANAL, GUARDAR ESO EN EL 
            LOCALSTORAGE Y ATUOMATICAMENTE CORRER EL FILTER. ESO VA A HACER QUE AUTOMATICAMENTE SE LLENE EN MONTHLY Y YEARLY POR
            LA FECHA. Y EVITARIA REPETIR TANTO EL CODIGO, ADEMAS, LA FUNCION QUE SE ENCARGA DE TRAER LOS LI DEL LOCALSTORAGE AL
            DOM Y HACERLES APPEND AL DIV CORRESPONDIENTE PODRIA SER UNA UNICA FUNCION CUSTOMIZABLE CON PARAMETROS, PARA NO TENER
            3 FUNCIONES DIFERENTES PARA CADA DIV. EVITANDO ASI NUEVAMENTE LA REPETICION.

            */


/* JSFIDDLE JSFIDDLE JSFIDDLE
function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    return today = dd + '/' + mm + '/' + yyyy;
}
function taskUserCreated(name, hstimes, xp, creationDate) {
    this.taskName = name;
    this.hsOrTime = hstimes;
    this.xpReward = xp;
    this.creationDate = creationDate;
}

function outerHtmlToObject(outerHtmlString) {
    let taskName = outerHtmlString.substring(outerHtmlString.indexOf("•")+1,outerHtmlString.indexOf("<", outerHtmlString.indexOf("•") ));
    let taskXP = outerHtmlString.substring(outerHtmlString.indexOf("+")+1,outerHtmlString.indexOf("<", outerHtmlString.indexOf("+") ));
    let taskCreationDate = getTodayDate();
    const taskAsObject = new taskUserCreated();

    Object.defineProperties(taskAsObject, {
        taskName: {
            value: taskName
        },
        xpReward: {
            value: taskXP
        },
        creationDate: {
            value: taskCreationDate
        }
    });
    return taskAsObject
}



allTasksDone = [[]];
function checkIfTaskHasBeenDoneAlready(todayTaskLI) {
    for(let i=0;i<allTasksDone.length;i++){
    		if(allTasksDone[0][0] == undefined) {
        console.log("entro")
            allTasksDone.push(todayTaskLI)

        }
        else if(allTasksDone[i][0][0].taskName.includes(todayTaskLI.taskName)) {

            allTasksDone[i].push(todayTaskLI)

        }
        else if(!allTasksDone[i][0].taskName.includes(todayTaskLI.taskName)) {
            let newTaskArray = [todayTaskLI];
            allTasksDone.push(newTaskArray);

        }
    }
}

checkIfTaskHasBeenDoneAlready( outerHtmlToObject(  `<p class="taskAdded bodyText"> •Go to the gym</p> <input class="amountTimes bodyText" type="number" min="1" value="1" fdprocessedid="0m7xxh"> <span class="taskXP favouriteColor">+222xp</span> <img class="deleteIcon hidePRO" src="imgs/deleteIcon.png" style="display:none" alt="" alreadyhasclicklistenerfordelete="true">`   ) )

checkIfTaskHasBeenDoneAlready( outerHtmlToObject(  `<p class="taskAdded bodyText"> •Go to the gym</p> <input class="amountTimes bodyText" type="number" min="1" value="1" fdprocessedid="0m7xxh"> <span class="taskXP favouriteColor">+222xp</span> <img class="deleteIcon hidePRO" src="imgs/deleteIcon.png" style="display:none" alt="" alreadyhasclicklistenerfordelete="true">`   ) )


console.log(allTasksDone)*/

let leftclickablearrow = document.getElementById("leftclickablearrow");
let rightclickablearrow = document.getElementById("rightclickablearrow");
let sectionTitle = document.getElementById("sectionTitle");

leftclickablearrow.addEventListener("click", leftclickableArrow =>{ 

    console.log("damn im working");
    if(sectionTitle.innerText === "This week"){

        setTimeout(() => {
            ulWeekTasks.classList.add('hide');
        }, 500);
        ulWeekTasks.classList.remove('notInvisible');
        ulWeekTasks.classList.add('invisible');


            ulYearTasks.classList.remove('hide');
            setTimeout(() => {
                ulYearTasks.classList.remove('invisible');
                ulYearTasks.classList.add('notInvisible');
            }, 500);

        sectionTitle.innerText = "This year";
    } else if(sectionTitle.innerText === "This year"){
        ulYearTasks.classList.remove('notInvisible');
        ulYearTasks.classList.add('invisible');
        setTimeout(() => {
            ulYearTasks.classList.add('hide');
        }, 500);

            ulMonthTasks.classList.remove('hide');
            setTimeout(() => {
                ulMonthTasks.classList.remove('invisible');
                ulMonthTasks.classList.add('notInvisible');
            }, 500);

        sectionTitle.innerText = "This month";
    } else if (sectionTitle.innerText === "This month") {

        ulMonthTasks.classList.remove('notInvisible');
        ulMonthTasks.classList.add('invisible');
        setTimeout(() => {
            ulMonthTasks.classList.add('hide');
        }, 500);

            ulWeekTasks.classList.remove('hide');
            setTimeout(() => {
                ulWeekTasks.classList.remove('invisible');
                ulWeekTasks.classList.add('notInvisible');
            }, 500);

        sectionTitle.innerText = "This week";
    }
})

rightclickablearrow.addEventListener("click", rightclickablearrow =>{ 

    console.log("damn im working");
    if(sectionTitle.innerText === "This week"){

        setTimeout(() => {
            ulWeekTasks.classList.add('hide');
        }, 500);
        ulWeekTasks.classList.remove('notInvisible');
        ulWeekTasks.classList.add('invisible');


        ulMonthTasks.classList.remove('hide');
            setTimeout(() => {
                ulMonthTasks.classList.remove('invisible');
                ulMonthTasks.classList.add('notInvisible');
            }, 500);

        sectionTitle.innerText = "This month";
    } else if(sectionTitle.innerText === "This year"){
        ulYearTasks.classList.remove('notInvisible');
        ulYearTasks.classList.add('invisible');
        setTimeout(() => {
            ulYearTasks.classList.add('hide');
        }, 500);

            ulWeekTasks.classList.remove('hide');
            setTimeout(() => {
                ulWeekTasks.classList.remove('invisible');
                ulWeekTasks.classList.add('notInvisible');
            }, 500);

        sectionTitle.innerText = "This week";
    } else if (sectionTitle.innerText === "This month") {

        ulMonthTasks.classList.remove('notInvisible');
        ulMonthTasks.classList.add('invisible');
        setTimeout(() => {
            ulMonthTasks.classList.add('hide');
        }, 500);

            ulYearTasks.classList.remove('hide');
            setTimeout(() => {
                ulYearTasks.classList.remove('invisible');
                ulYearTasks.classList.add('notInvisible');
            }, 500);

        sectionTitle.innerText = "This year";
    }
})

loadtasksArrayRecommendation();
loadWeekProgress();
loadCurrentXP();

//Changes boolean and colour of all LI inside tasks created UL for user understanding.
let deleteButtonClicked = false;
let alltasksLI = document.querySelectorAll("#tasksAddedList li");
deleteCreatedTask.addEventListener("click", callChangeULcolour => {
    changeULcolour();
})
function changeULcolour() {
    if(deleteButtonClicked === false) {
        deleteButtonClicked = true;
    } else if(deleteButtonClicked === true) {
        deleteButtonClicked = false;
    }
    alltasksLI = document.querySelectorAll("#tasksAddedList li");

    if(deleteButtonClicked === true) {
        alltasksLI.forEach(taskLI => {
            taskLI.style.backgroundColor = "#C70039"
        });
    } else if(deleteButtonClicked === false) {
        alltasksLI.forEach(taskLI => {
            taskLI.style.backgroundColor = ""
        });
    }
    console.log(alltasksLI);
}

//Removes tasks from DOM and Localstorage when clicked a 2nd time.
alltasksLI.forEach(task => {
    task.addEventListener("click", deleteTask )
});

function deleteTask(e) {
    let tasksColumn = JSON.parse(localStorage.getItem("task"));
    tasksArrayRecommendation = JSON.parse(localStorage.getItem("taskArrayrecommendation"));
    let taskName = e.target.innerText.substring(0, e.target.innerText.indexOf("+")-2);
        if(deleteButtonClicked === true) {
            for(var i=0; i < tasksColumn.length ; i++){
                if(tasksColumn[i].substring(tasksColumn[i].indexOf('">')+2, tasksColumn[i].indexOf('</p')) === taskName){
                    tasksColumn.splice(i, 1);
                    localStorage.setItem("task", JSON.stringify(tasksColumn));
                if( tasksArrayRecommendation[i].taskName === taskName){
                    tasksArrayRecommendation.splice(i,1);
                    localStorage.setItem("taskArrayrecommendation", JSON.stringify(tasksArrayRecommendation));
                    taskCreatedListStorage.splice(i,1);
                    console.log(taskCreatedListStorage);
                }
                    e.target.remove();
                    changeULcolour();
                    break;
                }
            }
        }
}

for (let task of tasksAddedList.children) {
    task.addEventListener("click", deleteTask);
  }

console.log(JSON.stringify(localStorage.getItem(localStorage)));

  ///
  /// AGREGAR FILTRO PARA QUE NO SE PUEDAN CARGAR DOS TASKS CON EL MISMO NOMBRE A LA VEZ
  ///
  /// ESTO VA A RESOLVER EL ISSUE DE QUE BORRANDO UNA TASK QUE APARECE DOS VECES SE BORRE LA 1RA Q APARECE Y NO LA SEGUNDA
///
///
/// PRIMERO ENCARGARSE DE QUE LA APP FUNCIONE OK, DSP HACER ESTO Y DEMAS PULIMIENTOS.
/// d