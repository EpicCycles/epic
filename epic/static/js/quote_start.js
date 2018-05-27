(setUpFrameOptions)();

// show the select customer pop up so they can select a customer
function newCustomerSelect(url, title) {
    popupDetail(url, title);
}

// triggered from popup this changes the quote customer but does not create the quote
function changeQuoteCustomer() {
    if (document.getElementById('new_customer_id').value !== '') {
        document.getElementById('id_customer').value = document.getElementById('new_customer_id').value;
        document.getElementById('form_action').value = 'change_customer';
        document.forms['new_quote_form'].submit();
    }
}

function changeQuoteType(quoteType) {
    var id_frame = document.getElementById("id_frame");
    var id_frame_sell_price = document.getElementById("id_frame_sell_price");
    var id_colour = document.getElementById("id_colour");
    var id_colour_price = document.getElementById("id_colour_price");
    var id_frame_size = document.getElementById("id_frame_size");
    if (quoteType.value === "B") {
        id_frame.disabled = false;
        id_frame_sell_price.disabled = false;
        id_colour.disabled = false;
        id_colour_price.disabled = false;
        id_frame_size.disabled = false;
        document.getElementById("bikeBrand").style.display = "block";
    } else {
        id_frame.value = '';
        id_frame_sell_price.disabled = true;
        id_colour.disabled = true;
        id_colour_price.disabled = true;
        id_frame_size.disabled = true;
        document.getElementById("bikeBrand").style.display = "none";
        document.getElementById("frameDiv").style.display = "none";
        document.getElementById("modelDiv").style.display = "none";
    }
}

function setUpFrameOptions() {
    var frame_selected = document.getElementById("id_frame").value;
    document.getElementById("frameDiv").style.display = "none";
    document.getElementById("modelDiv").style.display = "none";

    var brand_id;
    var frame_name_selected_init;
    var model_selected_init;
    //         return f'brand:"{self.brand.id}",frameId:"{self.id}",frameName:"{self.frame_name}",model:"{self.model}"'
    for (var i = 0; i < frames.length; i++) {
        if (frame_selected === frames[i].frameId) {
            brand_id = frames[i].brand;
            frame_name_selected_init = frames[i].frameName;
            model_selected_init = frames[i].model;
            $("#frame_brand").val(brand_id);
            processSelectedBrand();
        }
    }
}

function processSelectedBrand() {
    var brandSelectElement = document.getElementById("frame_brand");
    var frameElement = document.getElementById("frame_name");
    var brand_id = brandSelectElement.options[brandSelectElement.selectedIndex].value;
    var modelSelected = document.getElementById("id_frame").value;
    document.getElementById("frameDiv").style.display = "none";

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
                    if (modelSelected === frames[i].frameId) {
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
            document.getElementById("frameDiv").style.display = "block";
            processSelectedFrame();
        }
    }
}

function processSelectedFrame() {

    document.getElementById("modelDiv").style.display = "none";

    var frameSelectElement = document.getElementById("frame_name");
    var frame_name = frameSelectElement.options[frameSelectElement.selectedIndex].value;
    var modelElement = document.getElementById("model_name");
    var modelSelected = document.getElementById("id_frame").value;

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
            allOpt.value = "";
            allOpt.text = "--- Select Model ---";
            modelElement.add(allOpt, 0);
            modelElement.selectedIndex = modelOptionSelected;
            processSelectedModel();
            document.getElementById("modelDiv").style.display = "block";
        }
    }
}

function processSelectedModel() {
    var modelElement = document.getElementById("model_name");
    var selectedId = modelElement.options[modelElement.selectedIndex].value;
    document.getElementById("id_frame").value = selectedId;
    findModel: for (var i = 0; i < frames.length; i++) {
        if (frames[i].frameId === selectedId) {
            document.getElementById("id_frame_sell_price").value = frames[i].sellPrice;
            break findModel;
        }
    }
}


