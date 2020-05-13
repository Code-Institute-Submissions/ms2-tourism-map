let submitButton = document.getElementById("submit-note");
let userInput = document.getElementById("note-input");
let list = document.getElementById("notes-list");

// Simulate button click on enter
userInput.addEventListener("keydown", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      submitButton.click();
    }
  });

function addToLIst(){
    let newItemValue = document.getElementById("note-input").value;
    //.log(newItemValue);
    if(newItemValue == null || newItemValue == ""){
        console.log("Input is empty");
    }
    else {
        //create li element
        let newItem = document.createElement("li");
        newItem.className="note-item";
        let newItemContent = document.createTextNode(newItemValue);
        // delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerText="X";
        deleteBtn.className="del-btn";
        // Append text and elements inside li
        newItem.appendChild(newItemContent);
        newItem.appendChild(deleteBtn);
        list.appendChild(newItem);
        // console.log(list);
        
        

        //clear user input field
        userInput.value = "";

        // set currentCounter variable to the contents of "counter" or 0 if "counter" doesn't exist yet
        let currentCounter = localStorage.getItem("counter") || 0;
        localStorage.setItem("counter", ++currentCounter);

        localStorage.setItem("listItem", list.innerHTML);

    }
}
//Get stored list items if they exist on page load
let currentList = localStorage.getItem("listItem");
if (currentList){
    list.innerHTML = currentList;
}

//Delete individual item
document.querySelector('body').addEventListener('click', function(event) {
    if(event.target.className === 'del-btn') {
        //console.log(event.target.parentNode);
        //delete parent node(the li)
        event.target.parentNode.remove();
        //update the local storage with new list
        localStorage.setItem("listItem", list.innerHTML);
    }
});


function clearList() {
    if(confirm("This will clear your notes list. Are you sure?")) {
        let currentCounter = localStorage.removeItem("counter");
        let currentList = localStorage.removeItem("listItem");
        //remove first child nodes while there are some
        while(list.hasChildNodes()){
            list.removeChild(list.childNodes[0]);
        }
    } else {
        console.log("do not delete storage")
    }
}
function showCounter() {
    // set currentCounter variable to the contents of "counter" or 0 if "counter" doesn't exist yet
    let currentCounter = localStorage.getItem("counter") || 0;
    // display the current count in an alert
    alert("You clicked the button: " + currentCounter + " times.");
}
