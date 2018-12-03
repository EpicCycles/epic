import React from "react";
import ReactModal from 'react-modal';

import * as PropTypes from "prop-types";
import SupplierEdit from "./SupplierEdit";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

class SupplierModal extends React.Component {
    render() {
        const { supplierModalOpen, supplierToEdit, supplierId, saveSupplier, deleteSupplier, closeSupplierModal } = this.props;

        return <ReactModal
            isOpen={supplierModalOpen}
            contentLabel="Edit Suppler"
            className="Modal SupplierModal"
        >
            <SupplierEdit
                supplier={supplierToEdit ? supplierToEdit : {}}
                componentKey={supplierId ? supplierId : NEW_ELEMENT_ID}
                saveSupplier={saveSupplier}
                deleteSupplier={deleteSupplier}
                closeModal={closeSupplierModal}
            />
        </ReactModal>;
    }
}

SupplierModal.propTypes = {
    supplierModalOpen: PropTypes.any,
    supplierToEdit: PropTypes.any,
    supplierId: PropTypes.any,
    saveSupplier: PropTypes.any,
    deleteSupplier: PropTypes.any,
    closeSupplierModal: PropTypes.func
};

export default SupplierModal;