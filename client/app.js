async function loadGoals(archived){
    const response = await fetch(`/goals?archived=${archived}`);
    const goals = await response.json();
    const list = archived ? document.getElementById("inactiveList") : document.getElementById("activeList");
    list.replaceChildren();
    for(const goal of goals){
        const liElement =  document.createElement("li");
        liElement.textContent = goal.title;
        list.append(liElement);
    }
}
loadGoals(false);
loadGoals(true);