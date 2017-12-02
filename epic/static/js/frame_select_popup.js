// save the radio currently selected
function handleClick(myRadio) {
  window.opener.document.getElementById('new_frame_id').value = myRadio.value;
}
// trigger the correct action on the parent window
function selectAndClose() {
  if (window.opener && !window.opener.closed) {
    window.opener.copyQuoteNewBike();
  }
  self.close();
}
