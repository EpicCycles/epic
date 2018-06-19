// trigger the correct action on the parent window
function closeAddBrand() {
    self.close();
}

/**
 * take a newly added brand and add it to any selects for brand on parent page
 */
function addBrandToOpener(brand_id, brand_name) {
    var select_elements = window.opener.document.getElementsByTagName('select');
    var triggerSelect = window.opener.document.getElementById("brandSelectorId").value;
    for (var i = 0; i < select_elements.length; i++) {
        if (select_elements[i].id.indexOf('brand') >= 0) {
            var brandOpt = document.createElement("option");
            brandOpt.value = brand_id;
            brandOpt.text = brand_name;
            select_elements[i].add(brandOpt, 0);
            if ((select_elements[i].id === triggerSelect) && (!select_elements[i].disabled)) {
                select_elements[i].selectedIndex = 0;
            }
        }
    }
    closeAddBrand();
}
