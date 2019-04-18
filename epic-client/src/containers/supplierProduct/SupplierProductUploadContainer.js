import {connect} from 'react-redux'
import {saveBrands, saveSupplier} from "../../state/actions/core";
import {saveFramework} from "../../state/actions/framework";
import {clearParts, uploadParts} from "../../state/actions/part";
import SupplierProductUpload from "../../components/supplierProduct/SupplierProductUpload";

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
    saveSupplier,
    saveBrands,
    saveFramework,
    uploadParts,
    clearParts
};
export default connect(mapStateToProps, mapDispatchToProps)(SupplierProductUpload)

