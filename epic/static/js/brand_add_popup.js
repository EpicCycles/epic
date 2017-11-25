// trigger the correct action on the parent window
function closeAddBrand() {
  if (window.opener && !window.opener.closed) {
    window.opener.location.reload();
    window.opener.focus();
  }
  self.close();
}
