function setUpFrameOptions() {
    document.getElementById("frameDiv").style.display = "none";
    document.getElementById("modelDiv").style.display = "none";
}

function processSelectedBrand() {
    let brandSelectElement = document.getElementById("frame_brand");
    let frameElement = document.getElementById("frame_name");
    let brand_id = brandSelectElement.options[brandSelectElement.selectedIndex].value;
    document.getElementById("frameDiv").style.display = "none";

    frameElement.innerHTML = "";
    let usedFrames = [];
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
                }
            }
        }
        if (usedFrames.length > 0) {
            let allOpt = document.createElement("option");
            allOpt.value = "";
            allOpt.text = "--- Select Frame ---";
            frameElement.add(allOpt, 0);
            frameElement.selectedIndex = 0;
            document.getElementById("frameDiv").style.display = "block";
            processSelectedFrame();
        }
    }
}

function processSelectedFrame() {

    document.getElementById("modelDiv").style.display = "none";

    let frameSelectElement = document.getElementById("frame_name");
    let frame_name = frameSelectElement.options[frameSelectElement.selectedIndex].value;
    let modelElement = document.getElementById("model_name");

    modelElement.innerHTML = "";
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
                }
            }
        }
        if (usedModels.length > 0) {
            let allOpt = document.createElement("option");
            allOpt.value = "";
            allOpt.text = "--- Select Model ---";
            modelElement.add(allOpt, 0);
            modelElement.selectedIndex = 0;
            document.getElementById("modelDiv").style.display = "block";
        }
    }
}
