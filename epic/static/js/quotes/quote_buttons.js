
function copyWithNewBikeOrCustomer(url, quoteId) {
    $("#copy_quote_id").val(quoteId);
    popupDetail(url,'Choose new value for quote copy');
}

function copyQuoteNewBike() {
    if (document.getElementById('new_frame_id').value !== '') {
        document.forms['copy_quote_changes_form'].submit();
    }
}

// triggered from popup this changes the quote customer but does not create the quote
function changeQuoteCustomer() {
     if (document.getElementById('new_customer_id').value !== '') {
        document.forms['copy_quote_changes_form'].submit();
    }
}