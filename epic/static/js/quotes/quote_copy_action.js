// triggered from popup this sets the order to the new customer so they can edit it
function copyQuoteNewBike() {
    if (document.getElementById('new_frame_id').value !== '') {
        document.forms['change_frame_form'].submit();
    }
}
