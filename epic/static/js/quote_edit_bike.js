(setColumnWidths)();

function setColumnWidths() {
    var headerRow = document.getElementById("bike_header");
    var detailRow = document.getElementById("bike_row");
    if (detailRow) {

        if (!detailRow.hasChildNodes()) {
            console.log("not node with children");
            return;
        }

        var headerNodeList = headerRow.cells;
        var detailNodeList = detailRow.cells;
        if (detailNodeList.length < 1) {
            console.log("No nodes for details row");
            return;
        }
        if (detailNodeList.length !== headerNodeList.length) {
            console.log("number of header and details columns not the same");
            return;
        }

        for (var i = 0; i < detailNodeList.length; i++) {
            var applyWidth = detailNodeList[i].offsetWidth;
            if (applyWidth < headerNodeList[i].offsetWidth) {
                applyWidth = headerNodeList[i].offsetWidth;
            }
            headerNodeList[i].style.width = applyWidth + 'px';
            headerNodeList[i].style.paddingLeft = '0px';
            headerNodeList[i].style.paddingRight = '0px';

            detailNodeList[i].style.width = applyWidth + 'px';
            detailNodeList[i].style.paddingLeft = '0px';
            detailNodeList[i].style.paddingRight = '0px';
        }
    }
}
