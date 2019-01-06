import {connect} from 'react-redux'
import {getBrandsAndSuppliers} from "../../state/actions/core";
import {getFramework} from "../../state/actions/framework";
import {clearParts, listParts, saveSupplierParts, updateParts, updateSupplierProducts} from "../../state/actions/part";
import SupplierProductReview from "../../components/supplierProduct/SupplierProductReview";

const mapStateToProps = ({ core, framework, part }) => {
    return {
        brands: core.brands,
        suppliers: core.suppliers,
        sections: framework.sections,
        isLoading: (framework.isLoading || core.isLoading || part.isLoading),
        parts: part.parts,
        supplierProducts: part.supplierProducts,
    }
};
const mapDispatchToProps = {
    getBrandsAndSuppliers,
    getFramework,
    listParts,
    clearParts,
    saveSupplierParts,
    updateParts,
    updateSupplierProducts,
};
export default connect(mapStateToProps, mapDispatchToProps)(SupplierProductReview)

