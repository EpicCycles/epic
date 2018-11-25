import {connect} from 'react-redux'
import {getBrandsAndSuppliers, saveBrands, updateBrands, saveSupplier, deleteSupplier} from "../../state/actions/core";
import Brands from "../../components/brand/Brands";

export default connect(({core}) => ({
    brands: core.brands,
    suppliers: core.suppliers,
    isLoading: core.isLoading,
}), {
    getBrandsAndSuppliers,
    saveBrands,
    updateBrands,
    saveSupplier,
    deleteSupplier
})(Brands)
