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
        //Text Element
        const progressText = document.createElement("span");
        progressText.classList.add("progressText"); 
        progressText.textContent =  `${goal.progress.completed} out of ${goal.progress.total} subgoals completed`;
        track.append(fill,progressText);
        liElement.append(track);
        
        list.append(liElement);

    }
}
loadGoals(false);
loadGoals(true);