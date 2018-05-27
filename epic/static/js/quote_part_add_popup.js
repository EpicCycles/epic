// trigger the correct action on the parent window
function closeAddQuotePart() {
    self.close();
}

/**
 * take a newly added brand and add it to any selects for brand on parent page
 */
function addPartToQuote(rowId) {
    if (window.opener && !window.opener.closed) {
        let tr = document.getElementById(rowId);
        let newRow = tr.cloneNode(true);
        window.opener.addRowToQuoteTable(newRow);
        if (confirm("Part has been added to quote. \n Do you want to add another?")){
            return;
        } else {
            closeAddQuotePart();
        }
    } else {
        closeAddQuotePart();
    }
}
