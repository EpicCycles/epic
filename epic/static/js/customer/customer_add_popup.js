/**
 * trigger the correct action on the parent window
 */
function closeAddCustomer() {
    if (window.opener && !window.opener.closed) {
        window.opener.location.reload();
        window.opener.focus();
    }
    self.close();
}


/**
 * When a customer is selected populate the id in the parent (if open) and close popup.
 * @param customer_id
 */
function returnCustomerToOpener(customer_id) {
    if (window.opener && !window.opener.closed) {
        window.opener.document.getElementById('new_customer_id').value = customer_id;
        window.opener.changeQuoteCustomer();
    }
    self.close();
}

