// show the select customer pop up so they can select a customer
function newCustomerSelect(url, title) {
    popupDetail(url, title);
}

// triggered from popup this sets the order to the new customer so they can edit it
function changeQuoteCustomer() {
    if (document.getElementById('new_customer_id').value !== '') {
        document.forms['change_details_form'].submit();
    }
}

function copyQuoteNewBike() {
    if (document.getElementById('new_frame_id').value !== '') {
        document.forms['change_details_form'].submit();
    }
}
