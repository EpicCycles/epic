(initFunction)();

function initFunction() {
    window.onsubmit = hit;
}


function hit() {
    console.log('deposit_taken' + document.getElementById('deposit_taken').value);
    console.log('action_required' + document.getElementById('action_required').value);
}

function setAction(required_action) {
    document.getElementById('action_required').value = required_action;
    alert('submit');
    document.forms["quoteForm"].submit();
}

function getDepositAmount(quote_total) {
    var deposit = Number(window.prompt("If a deposit has been taken please record it here, total quote cost is £ " + quote_total, ""));
    if (deposit > quote_total) {
        deposit = Number(window.prompt("Deposit should be lower than total quote cost of £ " + quote_total, deposit));
    }
    if (isNaN(deposit)) {
        document.getElementById('deposit_taken').value = "";
    } else {
        document.getElementById('deposit_taken').value = deposit.toFixed(2);
    }
    setAction("Order");
}