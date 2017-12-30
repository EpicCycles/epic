// show prompt popup for the new bike
function createStandardBuild(brand, frame_name, base_model) {
    var model = window.prompt('New Model name for Frame ' + brand + ' ' + frame_name, base_model);
    if (model !== null) {
        if (model === base_model) {
            model = window.prompt('New Model name for Frame must be different ' + brand + ' ' + frame_name, base_model);
        }
        if (model === "") {
            model = window.prompt('New Model name for Frame must not be blank ' + brand + ' ' + frame_name, base_model);
        }
        if (model === base_model || model === "") {
            alert("Please try again");
            return false;
        } else {
            alert('Saving as Frame ' + brand + ' ' + frame_name + ' ' + model);
            document.getElementById('model').value = model;
            document.forms['create_model_form'].submit();
        }
    }
    else {
        return false;
    }
}
