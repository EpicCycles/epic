(initFunction)();

function initFunction() {
}

function setAction(required_action) {
    document.getElementById('action_required').value = required_action;
    document.forms["quoteForm"].submit();
}
