(startUp)();

function startUp() {
    if (document.getElementById("frameDiv")) {
        setUpFrameOptions();
    }
    if (document.getElementById("quote_part_table") && document.getElementById("bike_summary")) {
        hilightChangesForBike();
    }
}

//  get all bike parts and check each substitite table row and hilight those that have changes
function hilightChangesForBike() {
    let part_type_elements = $("select[name~='part_type']");
    const re = /part_type/gi;

    $('[id*="bike_"]').removeClass("red");
    console.log("removed red from all");
    console.log("items to check: ", part_type_elements.length);

    $('select[id$="part_type"]').each(function () {

        const part_type_id = $(this).attr('id');
        let partTypeSelected = $(this).find('option:selected').text();
        const replacementPartId = part_type_id.replace(re, "replacement_part");

        // for each part name object look for branch and part type objects
        console.log("part type selected:", partTypeSelected, " and replacement element id: ", replacementPartId)

        // if fields found add the options valid to the parts field
        if ($("#" + replacementPartId).is(":checked")) {
            console.log("checked ");
            $('[id*="bike_"]').filter(function () {
                return ($(this).text().startsWith(partTypeSelected))
            }).addClass("red");
        }
    });
}

// called from popup
function addRowToQuoteTable(newRow) {
    let table = document.getElementById("quote_part_table");
    table.appendChild(newRow);
    if (document.getElementById("bike_summary")) {
        hilightChangesForBike();
    }
    return;
}

// remove a row from the quote part table.
function removeRow(rowId) {
    let row = document.getElementById(rowId);
    row.parentNode.removeChild(row);
    if (document.getElementById("bike_summary")) {
        hilightChangesForBike();
    }
}

// show the select customer pop up so they can select a customer
function newCustomerSelect(url, title) {
    popupDetail(url, title);
}

// triggered from popup this changes the quote customer but does not create the quote
function changeQuoteCustomer() {
    const selectedCustomerId = document.getElementById("new_customer_id").value;
    if (selectedCustomerId !== '') {
        document.getElementById("id_customer").value = selectedCustomerId;
        document.getElementById("form_action").value = "change_customer";
        alert('about to submit form ' + selectedCustomerId);
        document.forms["quote_form"].submit();
    }
}



