(setUpFrameOptions)();


function setUpFrameOptions() {
    var brand_id = document.getElementById("brand_selected_init").value;
    var frame_name_selected_init = document.getElementById("frame_name_selected_init").value;
    var model_selected_init = document.getElementById("model_selected_init").value;
    document.getElementById("frameDiv").style.visibility = "hidden";
    document.getElementById("modelDiv").style.visibility = "hidden";
    document.getElementById("reviewButton").setAttribute("disabled", "disabled");

    if (brand_id) {
        $("#frame_brand").val(brand_id);
        processSelectedBrand();
    }
    if (frame_name_selected_init) {
        $("#frame_name").val(frame_name_selected_init);
        processSelectedFrame();
    }
     // now set column widths
    setColumnWidths();
}

function setReviewAction(required_action) {
    document.getElementById("action_required").value = required_action;
    const frameBrandSelector = $("#frame_brand");

    if (required_action !== "startReview") {
        if (required_action === "save_changes") {
            // reset page changed flag as this is ok.
            pageChanged = false;
        }

        // get back current selections and if they have changed alart
        var brand_selected_init = document.getElementById("brand_selected_init").value;
        var frame_brand = frameBrandSelector.val();
        var frame_name_selected = document.getElementById("frame_name_selected").value;
        var frame_name_selected_init = document.getElementById("frame_name_selected_init").value;
        var model_selected = document.getElementById("model_selected").value;
        var model_selected_init = document.getElementById("model_selected_init").value;
        if ((frame_brand !== brand_selected_init)
            || (frame_name_selected !== frame_name_selected_init)
            || (model_selected !== model_selected_init)) {
            if (confirm("You have changed the selections, continuing will display bikes matching new selections, do you want to save other changes?")) {
                if (required_action === "save_changes") {
                    document.getElementById("action_required").value = "save_and_show_new_selection";
                } else {
                    pageChanged = false;
                    document.getElementById("action_required").value = "startReview";
                }
            } else {
                frameBrandSelector.val(brand_selected_init);
                document.getElementById("frame_name_selected").value = frame_name_selected_init;
                document.getElementById("model_selected").value = model_selected_init;
            }
        }
    }
    if (checkForChanges()) {
        pageChanged = false;
        document.forms["reviewBikes"].submit();
    }
}


function processSelectedBrand() {
    var frameElement = document.getElementById("frame_name");
    var brandSelectElement = document.getElementById("frame_brand");
    var brand_id = brandSelectElement.options[brandSelectElement.selectedIndex].value;
    var frameNameSelected = document.getElementById("frame_name_selected");
    document.getElementById("frameDiv").style.visibility = "hidden";

    frameElement.innerHTML = "";
    var usedFrames = [];
    var selectedFrameOption = 0;
    if (brand_id) {
        for (var i = 0; i < frames.length; i++) {
            if (brand_id === frames[i].brand) {
                var thisFrameName = frames[i].frameName;
                if (usedFrames.indexOf(thisFrameName) < 0) {
                    usedFrames.push(thisFrameName);

                    var nameOpt = document.createElement("option");
                    nameOpt.value = thisFrameName;
                    nameOpt.text = thisFrameName;
                    frameElement.add(nameOpt, null);
                    if (frameNameSelected === thisFrameName) {
                        selectedFrameOption = usedFrames.length;
                    }
                }
            }
        }
        if (usedFrames.length > 0) {
            var allOpt = document.createElement("option");
            allOpt.value = "None";
            allOpt.text = "--- Select Frame ---";
            frameElement.add(allOpt, 0);
            frameElement.selectedIndex = selectedFrameOption;
            document.getElementById("frameDiv").style.visibility = "visible";
            processSelectedFrame();
        }
    }
}

function processSelectedFrame() {

    document.getElementById("reviewButton").setAttribute("disabled", "disabled");
    document.getElementById("modelDiv").style.visibility = "hidden";

    var frameSelectElement = document.getElementById("frame_name");
    var frame_name = frameSelectElement.options[frameSelectElement.selectedIndex].value;
    var modelElement = document.getElementById("model_name");
    document.getElementById("frame_name_selected").value = frame_name;
    var modelSelected = document.getElementById("model_selected").value;

    modelElement.innerHTML = "";
    var modelOptionSelected = 0;
    var usedModels = [];
    if (frame_name && (frame_name !== "None")) {
        for (var i = 0; i < frames.length; i++) {
            if (frame_name === frames[i].frameName) {
                var thisModel = frames[i].frameId;
                if (usedModels.indexOf(thisModel) < 0) {

                    usedModels.push(thisModel);

                    var nameOpt = document.createElement("option");
                    nameOpt.value = thisModel;
                    nameOpt.text = frames[i].model;
                    modelElement.add(nameOpt, null);
                    if (modelSelected === thisModel) {
                        // selected index increment by 1 because will add All at the top
                        modelOptionSelected = usedModels.length;
                    }
                }
            }
        }
        if (usedModels.length > 0) {
            var allOpt = document.createElement("option");
            allOpt.value = "ALL";
            allOpt.text = "Review all";
            modelElement.add(allOpt, 0);
            modelElement.selectedIndex = modelOptionSelected;
            processSelectedModel();
            document.getElementById("modelDiv").style.visibility = "visible";
        }
    }
}

function processSelectedModel() {
    document.getElementById("reviewButton").removeAttribute("disabled");
    var modelElement = document.getElementById("model_name");
    document.getElementById("model_selected").value = modelElement.options[modelElement.selectedIndex].value;
}

function setColumnWidths() {
    var headerRow = document.getElementById("bike_header");
    var detailRow = document.getElementById("bike_row");
    if (detailRow) {

        if (!detailRow.hasChildNodes()) {
            return;
        }

        var headerNodeList = headerRow.cells;
        var detailNodeList = detailRow.cells;
        if (detailNodeList.length < 1) {
            return;
        }
        if (detailNodeList.length !== headerNodeList.length) {
            return;
        }

        for (var i = 0; i < detailNodeList.length; i++) {
            var applyWidth = detailNodeList[i].offsetWidth;
            if (applyWidth < headerNodeList[i].offsetWidth) {
                applyWidth = headerNodeList[i].offsetWidth;
            }
            headerNodeList[i].style.width = applyWidth + "px";
            headerNodeList[i].style.paddingLeft = "0px";
            headerNodeList[i].style.paddingRight = "0px";

            detailNodeList[i].style.width = applyWidth + "px";
            detailNodeList[i].style.paddingLeft = "0px";
            detailNodeList[i].style.paddingRight = "0px";
        }
    }
}
