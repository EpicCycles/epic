import {connect} from 'react-redux'
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
    listParts,
    clearParts,
    saveSupplierParts,
    updateParts,
    updateSupplierProducts,
};
export default connect(mapStateToProps, mapDispatchToProps)(SupplierProductReview)

