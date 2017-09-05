var pageChanged = false;
// add event listeners to all input objects
function addListeners() {
    //get all input elements
    var inputs = document.getElementsByTagName('input');
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].addEventListener) {                    // For all major browsers, except IE 8 and earlier
        inputs[i].addEventListener("change", setChangeFlag);
      } else if (x.attachEvent) {                  // For IE 8 and earlier versions
        inputs[i].attachEvent("change", setChangeFlag);
      }
    }

    // get all links and add a =n onclick to those not opening in a new window
    var links = document.getElementsByTagName('a');
    for (i = 0; i < links.length; i++) {
      if (links[i].target != "_blank") {
        if (links[i].addEventListener) {                    // For all major browsers, except IE 8 and earlier
          links[i].addEventListener("click", checkForChanges);
        } else if (x.attachEvent) {                  // For IE 8 and earlier versions
          links[i].attachEvent("click", checkForChanges);
        }
      }
    }
}

function setChangeFlag() {
  pageChanged = true;
}

// if anything has changed need to confirm going away in case changes lost
function checkForChanges() {
  if (pageChanged) {
     if (confirm("You may have unsaved changes, are you sure?")) {
       return true;
     } else {
       event.returnValue = false;
       event.cancel = true;
       if (event.preventDefault) {
         event.preventDefault();
       }
     }
  }
}
