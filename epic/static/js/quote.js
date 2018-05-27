(startUp)();

function startUp() {
    if (document.getElementById("frameDiv")) {
        setUpFrameOptions();
    }
    if (document.getElementById("quote_part_table") && document.getElementById("bike_summary")) {
        hilightChangesForBike();
    }
}

//  get all bike parts and check each substitite table row and hilight those that have changes
function hilightChangesForBike() {
    let part_type_elements = $( "select[name~='part_type']" );
    const re = /part_type/gi;

    $('[id*="bike_"]').removeClass("red");
    console.log("removed red from all");
    console.log("items to check: ", part_type_elements.length);

    $('select[id$="part_type"]').each(function () {

        const part_type_id = $(this).attr('id');
        let partTypeSelected = $(this).find('option:selected').text();
        const replacementPartId = part_type_id.replace(re, "replacement_part");

        // for each part name object look for branch and part type objects
        console.log("part type selected:", partTypeSelected, " and replacement element id: ", replacementPartId)

        // if fields found add the options valid to the parts field
        if ( $("#" + replacementPartId).is( ":checked" ) ) {
            console.log("checked ");
            $('[id*="bike_"]').filter(function() { return ($(this).text().startsWith(partTypeSelected)) }).addClass("red");
        }
    });
}

// called from popup
function addRowToQuoteTable(newRow) {
    let table = document.getElementById("quote_part_table");
    table.appendChild(newRow);
    if (document.getElementById("bike_summary")) {
        hilightChangesForBike();
    }
    return;
}

// remove a row from the quote part table.
function removeRow(rowId) {
    let row = document.getElementById(rowId);
    row.parentNode.removeChild(row);
    if (document.getElementById("bike_summary")) {
        hilightChangesForBike();
    }
}

// show the select customer pop up so they can select a customer
function newCustomerSelect(url, title) {
    popupDetail(url, title);
}

// triggered from popup this changes the quote customer but does not create the quote
function changeQuoteCustomer() {
    if (document.getElementById("new_customer_id").value !== '') {
        document.getElementById("id_customer").value = document.getElementById("new_customer_id").value;
        document.getElementById("form_action").value = "change_customer";
        document.forms["quote_form"].submit();
    }
}

function changeQuoteType(quoteType) {
    let id_frame = document.getElementById("id_frame");
    let id_frame_sell_price = document.getElementById("id_frame_sell_price");
    let id_colour = document.getElementById("id_colour");
    let id_colour_price = document.getElementById("id_colour_price");
    let id_frame_size = document.getElementById("id_frame_size");
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
    let frame_selected = document.getElementById("id_frame").value;
    document.getElementById("frameDiv").style.display = "none";
    document.getElementById("modelDiv").style.display = "none";

    let brand_id;
    let frame_name_selected_init;
    let model_selected_init;
    //         return f'brand:"{self.brand.id}",frameId:"{self.id}",frameName:"{self.frame_name}",model:"{self.model}"'
    for (let i = 0; i < frames.length; i++) {
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
    let brandSelectElement = document.getElementById("frame_brand");
    let frameElement = document.getElementById("frame_name");
    let brand_id = brandSelectElement.options[brandSelectElement.selectedIndex].value;
    let modelSelected = document.getElementById("id_frame").value;
    document.getElementById("frameDiv").style.display = "none";

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
                    if (modelSelected === frames[i].frameId) {
                        selectedFrameOption = usedFrames.length;
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
    let modelSelected = document.getElementById("id_frame").value;

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
                        modelOptionSelected = usedModels.length;
                    }
                }
            }
        }
        if (usedModels.length > 0) {
            let allOpt = document.createElement("option");
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
    let modelElement = document.getElementById("model_name");
    let selectedId = modelElement.options[modelElement.selectedIndex].value;
    document.getElementById("id_frame").value = selectedId;
    findModel: for (let i = 0; i < frames.length; i++) {
        if (frames[i].frameId === selectedId) {
            document.getElementById("id_frame_sell_price").value = frames[i].sellPrice;
            break findModel;
        }
    }
}


