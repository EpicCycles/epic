var pageChanged = false;

// add event listeners to all input objects
function addListeners() {
    //get all input elements
    attachChangeEventToList(document.getElementsByTagName('input'));
    attachChangeEventToList(document.getElementsByTagName('textarea'));

    // get all links and add a =n onclick to those not opening in a new window
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].target != "_blank") {
            if (links[i].addEventListener) {                    // For all major browsers, except IE 8 and earlier
                links[i].addEventListener("click", checkForChanges);
            } else if (links[i].attachEvent) {                  // For IE 8 and earlier versions
                links[i].attachEvent("click", checkForChanges);
            }
        }
    }

    var buttons = document.querySelectorAll('input[type="button"]');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].addEventListener) {                    // For all major browsers, except IE 8 and earlier
            buttons[i].addEventListener("click", checkForChanges);
        } else if (buttons[i].attachEvent) {                  // For IE 8 and earlier versions
            buttons[i].attachEvent("click", checkForChanges);
        }
    }

}

function attachChangeEventToList(inputs) {
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].addEventListener) {                    // For all major browsers, except IE 8 and earlier
            inputs[i].addEventListener("change", setChangeFlag);
        } else if (x.attachEvent) {                  // For IE 8 and earlier versions
            inputs[i].attachEvent("change", setChangeFlag);
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

// basic popup with url and title passed in
function popupDetail(url, title) {
    var width = screen.width / 2;
    var height = screen.height / 2;
    var left = (screen.width / 4);
    var top = (screen.height / 4);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
}
