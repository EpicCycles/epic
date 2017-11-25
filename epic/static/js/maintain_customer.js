
function changeQuoteType(quoteType) {
    var id_frame = document.getElementById("id_new-frame");
    var id_frame_sell_price = document.getElementById("id_new-frame_sell_price");
    var id_colour = document.getElementById("id_new-colour");
    var id_colour_price = document.getElementById("id_new-colour_price");
    var id_frame_size = document.getElementById("id_new-frame_size");
    if (quoteType.value === "B") {
        id_frame.disabled = false;
        id_frame_sell_price.disabled = false;
        id_colour.disabled = false;
        id_colour_price.disabled = false;
        id_frame_size.disabled = false;
    } else {
        id_frame.disabled = true;
        id_frame_sell_price.disabled = true;
        id_colour.disabled = true;
        id_colour_price.disabled = true;
        id_frame_size.disabled = true;
    }
}