// show the select customer pop up so they can select a customer
function newCustomerSelect(url, title) {
    popupDetail(url, title);
}

// triggered from popup this changes the quote customer but does not create the quote
function changeQuoteCustomer() {
    if (document.getElementById('new_customer_id').value !== '') {
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
    } else {
        id_frame.disabled = true;
        id_frame_sell_price.disabled = true;
        id_colour.disabled = true;
        id_colour_price.disabled = true;
        id_frame_size.disabled = true;
    }
}
