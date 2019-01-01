import {connect} from 'react-redux'
import {getBrandsAndSuppliers, saveBrands, saveSupplier} from "../../state/actions/core";
import {getFramework, saveFramework} from "../../state/actions/framework";
import {clearParts, uploadParts} from "../../state/actions/part";

const mapStateToProps = ({ core, framework, part }) => {
    return {
        brands: core.brands,
        suppliers: core.suppliers,
        sections: framework.sections,
        isLoading: (framework.isLoading || core.isLoading || part.isLoading),
        parts: part.parts,
        supplier_parts: part.supplier_parts,
    }
};
const mapDispatchToProps = {
    getBrandsAndSuppliers,
    saveSupplier,
    saveBrands,
    getFramework,
    saveFramework,
    uploadParts,
    clearParts
};
export default connect(mapStateToProps, mapDispatchToProps)(SupplierProductUpload)

