async function loadGoals(archived){
    const response = await fetch(`/goals?archived=${archived}`);
    const goals = await response.json();
    const list = archived ? document.getElementById("inactiveList") : document.getElementById("activeList");
       list.replaceChildren();
    for(const goal of goals){
        //GoalList
        const liElement =  document.createElement("li");
        liElement.classList.add("goalRow");
        
        //GoalInfo Div
        const goalInfo =  document.createElement("div");
        goalInfo.classList.add("goalInfo");
        const title =  document.createElement("h3"); //Title Element
        title.textContent = goal.title;
        const subCount = document.createElement("p"); //SubCount Element
        subCount.classList.add("subCount");
        subCount.textContent =  `${goal.subGoals.length} Subgoals`;
        goalInfo.append(title,subCount);
        liElement.append(goalInfo);

        //Progress Bar
        const track = document.createElement("div"); //Track Element
        track.classList.add("progressTrack");
        const fill = document.createElement("div"); //Fill Element
        fill.classList.add("progressFill");
        //Percentage
        const percentage = (goal.progress.completed / goal.progress.total) * 100;
        fill.style.width = `${percentage}%`;

        if(goal.progress.completed === 0){ //Not Started Value
            fill.classList.add("notStarted");
        }

        //Text Element
        const progressText = document.createElement("span");
        progressText.classList.add("progressText"); 
        progressText.textContent =  `${goal.progress.completed} out of ${goal.progress.total} subgoals completed`;
        track.append(fill,progressText);
       

        //Completed Goal
        if(goal.completedAt){
            const comDate = document.createElement("div");
            comDate.classList.add("completedDate");

            const comTime = document.createElement("time");
            comTime.setAttribute("datetime", goal.completedAt);
            const dateObj = new Date(goal.completedAt);
            const options = { day: "numeric", month: "short", year: "numeric" };
            comTime.textContent = dateObj.toLocaleDateString(undefined, options);
            comDate.append("Completed: ", comTime);
            liElement.append(comDate);

            //Complete Class
            fill.classList.add("complete");
        }

        liElement.append(track); // Appending Track

         //Goal Button
        const goalButton = document.createElement("button");
        goalButton.classList.add("pillButton");
        goalButton.setAttribute('aria-label','Open Goal');
        goalButton.textContent = ">>>";
        
        liElement.append(goalButton);
        list.append(liElement);
    }
    
    // Message if Goals / Archived Goals are empty:
    const emptyState =  archived ? document.getElementById("emptyInactive") : document.getElementById("emptyActive");
    emptyState.hidden = goals.length >=1; 

}
loadGoals(false);
loadGoals(true);


//Add New Goal Popup
const openNewGoalButton = document.getElementById("addNewGoal")
const closeNewGoalButton = document.getElementById("closeNewGoalModal")
const newGoalModal = document.getElementById("openNewGoalModal")

openNewGoalButton.addEventListener("click",() => {
    newGoalModal.showModal();
})

closeNewGoalButton.addEventListener("click",() => {
    newGoalModal.close();
})