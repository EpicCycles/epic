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
