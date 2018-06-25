(initialFrameOptions)();


function initialFrameOptions() {
    setUpFrameOptions();
    var currentBrand = document.getElementById("brand_selected_init").value;
    var currentFrame = document.getElementById("frame_name_selected_init").value;
    var currentModel = document.getElementById("model_selected_init").value;
    if (currentBrand) {
        const frameBrandSelector = $("#frame_brand");
        frameBrandSelector.val(currentBrand);
        processSelectedBrand();

        if (currentFrame) {
            const frameSelector = $("#frame_name");
            frameSelector.val(currentFrame);
            processSelectedFrame();

            if (currentModel) {
                const modelSelector = $("#model_name");
                modelSelector.val(currentModel);
                processSelectedModel();
            }
        }
    }
    // now set column widths
    setColumnWidths();
}

function checkAndStartReview() {
    if ($("#frame_brand").val() && $("#frame_name").val()) {
        setReviewAction('startReview');
    } else {
        alert("Select a Brand and Frame to review.")
    }
}

function setReviewAction(required_action) {
    document.getElementById("action_required").value = required_action;
    const frameBrandSelector = $("#frame_brand");

    if (required_action === "startReview") {
        performActionRequested();
    } else if (required_action === "listModels") {
        performActionRequested();
    } else {
        if ((required_action === "save_changes") || (required_action === "process_actions")) {
            // reset page changed flag as this is ok.
            pageChanged = false;
        }

        // get back current selections and if they have changed alart
        var brand_selected_init = $("#brand_selected_init").val();
        var frame_brand = frameBrandSelector.val();
        var frame_name_selected = $("#frame_name").val();
        var frame_name_selected_init = $("#frame_name_selected_init").val();
        var model_selected = $("#model_name").val();
        var model_selected_init = $("#model_selected_init").val();

        if (! frame_name_selected) {
            frame_name_selected = ""
        }
        if (! model_selected) {
            model_selected = ""
        }

        if ((frame_brand !== brand_selected_init)
            || (frame_name_selected !== frame_name_selected_init)
            || (model_selected !== model_selected_init)) {
            if (confirm("You have changed the selections, continuing will display bikes for review matching new selections, do you want to save other changes?")) {
                if (required_action === "process_actions") {
                    document.getElementById("action_required").value = "process_actions_and_show_new_selection";
                } else if (required_action === "save_changes") {
                    document.getElementById("action_required").value = "save_and_show_new_selection";
                } else {
                    // should only be here is next bike was the option
                    pageChanged = false;
                    document.getElementById("action_required").value = "startReview";
                }
            } else {
                frameBrandSelector.val(brand_selected_init);
                $("#frame_name").val(frame_name_selected_init);
                $("#model_name").val(model_selected_init);
            }
        }
        performActionRequested();
    }

}

function performActionRequested() {
    if (checkForChanges()) {
        // save the current selections
        document.getElementById('frame_name_selected').value = $("#frame_name").val();
        document.getElementById('model_selected').value = $("#model_name").val();
        pageChanged = false;

        document.forms["reviewBikes"].submit();
    }
}


function processSelectedModel() {
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

function clickArchive(quoteId) {
    $("#setArchive" + quoteId).css("display", "none");
    $("#resetArchive" + quoteId).css("display", "block");
    $("#setEdit" + quoteId).css("display", "none");
    $("#resetEdit" + quoteId).css("display", "none");

    $("#archive" + quoteId).val("Y");
    $("#edit" + quoteId).val("");
}

function clickArchiveOff(quoteId) {
    $("#setArchive" + quoteId).css("display", "block");
    $("#resetArchive" + quoteId).css("display", "none");
    $("#setEdit" + quoteId).css("display", "block");
    $("#resetEdit" + quoteId).css("display", "none");

    $("#archive" + quoteId).val("");
    $("#edit" + quoteId).val("");
}

function clickEdit(quoteId) {
    $("#setArchive" + quoteId).css("display", "none");
    $("#resetArchive" + quoteId).css("display", "none");
    $("#setEdit" + quoteId).css("display", "none");
    $("#resetEdit" + quoteId).css("display", "block");

    $("#archive" + quoteId).val("");
    $("#edit" + quoteId).val("Y");
}

function clickEditOff(quoteId) {
    $("#setArchive" + quoteId).css("display", "block");
    $("#resetArchive" + quoteId).css("display", "none");
    $("#setEdit" + quoteId).css("display", "block");
    $("#resetEdit" + quoteId).css("display", "none");

    $("#archive" + quoteId).val("");
    $("#edit" + quoteId).val("");
}
