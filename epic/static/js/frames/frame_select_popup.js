(startUp)();

function startUp() {
    setUpFrameOptions();
    document.getElementById("selectAndClose").addEventListener("click", selectAndClose);
}

// trigger the correct action on the parent window
function selectAndClose() {
    if (window.opener && !window.opener.closed) {
        window.opener.copyQuoteNewBike();
    } else {
        alert('Could not use selection as quote screen has been closed.')
    }
    self.close();
}

function setUpFrameOptions() {
    document.getElementById("frameDiv").style.display = "none";
    document.getElementById("modelDiv").style.display = "none";
}

function processSelectedModel() {
    const modelElement = document.getElementById("model_name");
    const buttonElement = document.getElementById("selectAndClose");
    const selectedId = modelElement.options[modelElement.selectedIndex].value;
    window.opener.document.getElementById('new_frame_id').value = selectedId;
    buttonElement.disabled = selectedId <= 0;
}