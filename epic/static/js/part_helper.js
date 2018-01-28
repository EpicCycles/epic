const part_name = 'part_name';
const partName = 'partName';
const brand = 'brand';
const part_type = 'part_type';
const partType = 'partType';
const partArray = parts;
console.dir(typeof parts);
(setUpPartFields)();

function setUpPartFields() {
    //  get back all elements that ae called something like part_name
    console.log(partArray);
    var part_name_elements = $("input[id$='part_name']");
    const re = /part_name/gi;

    part_name_elements.each(function () {
        // get the ids for brand and parttype
        const partNameElement = $(this).get(0);
        const part_name_id = partNameElement.id;
        const brandId = part_name_id.replace(re, brand);
        const partTypeId = part_name_id.replace(re, part_type);

        // for each part name object look for branch and part type objects
        let brandElement = $("#" + brandId);
        let partTypeElement = $("#" + partTypeId);

        // if both fields found add the options valid to the parts field
        if (brandElement.length && partTypeElement.length) {
            refreshPartList(brandElement.val(), partTypeElement.val(), $(this));
            // add on change
            brandElement.change(selectBrand);
            partTypeElement.change(selectPartType);
        }
    })

}

function selectBrand() {
    let selectedElement = event.srcElement;
    let brandId = selectedElement.id;
    const re = /brand/gi;
    let brandElement = $("#" + brandId);
    let partTypeElement = $("#" + brandId.replace(re, part_type));
    let partNameElement = $("#" + brandId.replace(re, part_name));
    const brandValue = brandElement.val();
    const partTypeValue = partTypeElement.val();
    refreshPartList(brandValue, partTypeValue, partNameElement);
}

function selectPartType() {
    let selectedElement = event.srcElement;
    let partTypeId = selectedElement.id;
    const re = /part_type/gi;
    let partTypeElement = $("#" + partTypeId);
    let brandElement = $("#" + partTypeId.replace(re, brand));
    let partNameElement = $("#" + partTypeId.replace(re, part_name));
    const partTypeValue = partTypeElement.val();
    const brandValue = brandElement.val();
    refreshPartList(brandValue, partTypeValue, partNameElement);
}

function refreshPartList(brandValue, partTypeValue, partNameElement) {
    // get back brand from doc
    console.log("filtering on branch and part type", brandValue, partTypeValue);
    let relevantParts = partArray.filter(function (part) {
        let include = true;
        if (brandValue) {
            console.log("brand filter want and have, ", brandValue, part[brand]);
            if (part[brand] != brandValue) {
                console.log("excluded on brand");
                include = false;
            }
        }
        if (partTypeValue) {
            console.log("partType filter want and have, ", partTypeValue, part[partType]);
            if (part[partType] != partTypeValue) {
                console.log("excluded on partType");
                include = false;
            }
        }
        return include;
    });

    let relevantPartNames = relevantParts.map(function (part) {
        return part[partName];
    });

    // now populate the autocomplete for the part name field
    console.log("filtered parts", relevantParts);
    partNameElement.autocomplete({
        source: relevantPartNames
    });
}
