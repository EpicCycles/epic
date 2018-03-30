(setUpFrameOptions)();


function setUpFrameOptions() {
    let brand_id = document.getElementById("brand_selected_init").value;
    let frame_name_selected_init = document.getElementById("frame_name_selected_init").value;
    let model_selected_init = document.getElementById("model_selected_init").value;
    document.getElementById("frameDiv").style.visibility = "hidden";
    document.getElementById("modelDiv").style.visibility = "hidden";
    document.getElementById("reviewButton").setAttribute("disabled", "disabled");

    if (brand_id) {
        $('#frame_brand').val(brand_id);
        processSelectedBrand();
    }
    if (frame_name_selected_init) {
        $('#frame_name').val(frame_name_selected_init);
        processSelectedFrame();
    }
    if (model_selected_init) {
        $('#model_name').val(model_selected_init);
        document.getElementById("model_selected").value = model_selected_init;
    }
    // now set column widths
    setColumnWidths();
}

function setReviewAction(required_action) {
    document.getElementById('action_required').value = required_action;
    const frameBrandSelector = $('#frame_brand');

    if (required_action !== "startReview") {
        if (required_action === "save_changes") {
            // reset page changed flag as this isok.
            pageChanged = false;
        }

        // get back current selections and if they have changed alart
        let brand_selected_init = document.getElementById("brand_selected_init").value;
        let frame_brand = frameBrandSelector.val();
        let frame_name_selected = document.getElementById("frame_name_selected").value;
        let frame_name_selected_init = document.getElementById("frame_name_selected_init").value;
        let model_selected = document.getElementById("model_selected").value;
        let model_selected_init = document.getElementById("model_selected_init").value;
        if ((frame_brand !== brand_selected_init)
            || (frame_name_selected !== frame_name_selected_init)
            || (model_selected !== model_selected_init)) {
            if (confirm("You have changed the selections, saving will display bikes matching new selections, do you want to rest the selections now?")) {
                if (required_action === "save_changes") {
                    document.getElementById('action_required').value = "save_and_show_new_selection";
                } else {
                    document.getElementById('action_required').value = "startReview";

                }
            } else {
                pageChanged = false;
                frameBrandSelector.val(brand_selected_init);
                document.getElementById("frame_name_selected").value = frame_name_selected_init;
                document.getElementById("model_selected").value = model_selected_init;
            }
        }
    }
    document.forms["reviewBikes"].submit();
}


function processSelectedBrand() {
    let frameElement = document.getElementById("frame_name");
    let brandSelectElement = document.getElementById("frame_brand");
    let brand_id = brandSelectElement.options[brandSelectElement.selectedIndex].value;
    let frameNameSelected = document.getElementById("frame_name_selected");
    document.getElementById("frameDiv").style.visibility = "hidden";

    frameElement.innerHTML = "";
    let usedFrames = [];
    let selectedFrameOption = 0;
    if (brand_id) {
        for (let i = 0; i < frames.length; i++) {
            if (brand_id === frames[i].brand) {
                let thisFrameName = frames[i].frameName;
                if (usedFrames.indexOf(thisFrameName) < 0) {
                    usedFrames.push(thisFrameName);

                    let nameOpt = document.createElement("option");
                    nameOpt.value = thisFrameName;
                    nameOpt.text = thisFrameName;
                    frameElement.add(nameOpt, null);
                    if (frameNameSelected === thisFrameName) {
                        selectedFrameOption = i + 1;
                    }
                }
            }
        }
        if (usedFrames.length > 0) {
            let allOpt = document.createElement("option");
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

    let frameSelectElement = document.getElementById("frame_name");
    let frame_name = frameSelectElement.options[frameSelectElement.selectedIndex].value;
    let modelElement = document.getElementById("model_name");
    document.getElementById("frame_name_selected").value = frame_name;
    let modelSelected = document.getElementById("model_selected").value;

    modelElement.innerHTML = "";
    let modelOptionSelected = 0;
    let usedModels = [];
    if (frame_name && (frame_name !== "None")) {
        for (let i = 0; i < frames.length; i++) {
            if (frame_name === frames[i].frameName) {
                let thisModel = frames[i].frameId;
                if (usedModels.indexOf(thisModel) < 0) {

                    usedModels.push(thisModel);

                    let nameOpt = document.createElement("option");
                    nameOpt.value = thisModel;
                    nameOpt.text = frames[i].model;
                    modelElement.add(nameOpt, null);
                    if (modelSelected === thisModel) {
                        // selected index increment by 1 because will add All at the top
                        modelOptionSelected = i + 1;
                    }
                }
            }
        }
        if (usedModels.length > 0) {
            let allOpt = document.createElement("option");
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
    let modelElement = document.getElementById("model_name");
    document.getElementById("model_selected").value = modelElement.options[modelElement.selectedIndex].value;
}

function setColumnWidths() {
    let headerRow = document.getElementById("bike_header");
    let detailRow = document.getElementById("bike_row");
    if (detailRow) {

        if (!detailRow.hasChildNodes()) {
            return;
        }

        let headerNodeList = headerRow.cells;
        let detailNodeList = detailRow.cells;
        if (detailNodeList.length < 1) {
            return;
        }
        if (detailNodeList.length !== headerNodeList.length) {
            return;
        }

        for (let i = 0; i < detailNodeList.length; i++) {
            let applyWidth = detailNodeList[i].offsetWidth;
            if (applyWidth < headerNodeList[i].offsetWidth) {
                applyWidth = headerNodeList[i].offsetWidth;
            }
            headerNodeList[i].style.width = applyWidth + 'px';
            headerNodeList[i].style.paddingLeft = '0px';
            headerNodeList[i].style.paddingRight = '0px';

            detailNodeList[i].style.width = applyWidth + 'px';
            detailNodeList[i].style.paddingLeft = '0px';
            detailNodeList[i].style.paddingRight = '0px';
        }
    }
}
