// save the radio currently selected
function handleClick(myRadio) {
    document.getElementById('selected_customer_id').value = myRadio.value;
    document.getElementById('use_customer').disabled = false;
}

// trigger the correct action on the parent window
function selectAndClose() {
    if (window.opener && !window.opener.closed) {
        window.opener.document.getElementById('new_customer_id').value = document.getElementById('selected_customer_id').value;
        window.opener.changeQuoteCustomer();
    }
    self.close();
}
