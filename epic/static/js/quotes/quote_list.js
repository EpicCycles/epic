(startUp)();

function startUp() {
    document.getElementById("frameDiv").style.display = "none";
    document.getElementById("modelDiv").style.display = "none";

    let currentBrand = document.getElementById('id_search_brand').value;
    let currentFrame = document.getElementById('id_search_frame').value;
    let currentModel = document.getElementById('id_search_model').value;
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
            }
        }
    }
}

function copyFrameSelections() {
    document.getElementById('id_search_brand').value = $("#frame_brand").val();
    document.getElementById('id_search_frame').value = $("#frame_name").val();
    document.getElementById('id_search_model').value = $("#model_name").val();
}

function processSelectedModel() {
    copyFrameSelections()
}