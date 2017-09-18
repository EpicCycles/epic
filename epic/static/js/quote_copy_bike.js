// show the select customer pop up so they can select a customer
function newCustomerSelect() {
  popupDetail(url,title);
}

// triggered from popup this setsthe order to the new customer so they can edit it
function changeQuoteCustomer() {
  if (document.getElementById('new_customer_id').value != '') {
      document.forms['change_customer_form'].submit();
  }
}
