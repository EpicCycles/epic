
function changeQuoteType(quoteType) {
    var frame_detail = document.getElementById("frame_detail");
    var id_frame = document.getElementById("id_new-frame");
    if (quoteType.value === "B") {
        frame_detail.style = "display:block;";
        id_frame.disabled = false;
    }else{
        frame_detail.style = "display:none;";
        id_frame.disabled = true;
    }
}