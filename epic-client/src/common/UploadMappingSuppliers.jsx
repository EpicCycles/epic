import React, {Fragment} from "react";
import {Button, Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../helpers/constants";
import SupplierModal from "../components/supplier/SupplierModal";

class UploadMappingSuppliers extends React.Component {
    constructor(props) {
        super();
        this.state = this.deriveStateFromProps(props);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.suppliers !== prevProps.suppliers) {
            const updatedRowMappings = this.state.rowMappings.map(rowMap => {
                this.props.suppliers.some(supplier => {
                    if (supplier.supplier_name.toLowerCase() === rowMap.supplierName.toLowerCase()) {
                        rowMap.supplier = supplier.id;
                        return true;
                    }
                    return false;
                });
                return rowMap
            });
            this.setState({ rowMappings: updatedRowMappings });
        }
    }

    deriveStateFromProps = (props) => {
        const { rowMappings } = props;
        return {
            showModal: false,
            rowMappings
        };
    };

    onChangeField = (fieldName, fieldValue) => {
        let newState = this.state;
        newState[fieldName] = fieldValue;
        this.setState(newState);
    };
    goToNextStep = () => {
        const { rowMappings } = this.state;
        this.props.addDataAndProceed({ rowMappings });
    };

    undoMapping = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                rowMap.ignore = false;
            }
            return rowMap;
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    discardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                rowMap.ignore = true;
            }
            return rowMap;
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    undoDiscardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                rowMap.ignore = false;
            }
            return rowMap;
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    setUpSupplierModalForNewField = (rowMap) => {
        const supplier = {
            shortName: rowMap.supplierName,
        };
        this.setState({
            supplier,
            showModal: true,
        });
    };

    handleCloseModal() {
        this.setState({ showModal: false, supplier: {} });
    }

    render() {
        const { saveSupplier } = this.props;
        const { rowMappings, showModal, supplier } = this.state;
        const unResolvedRowMappings = rowMappings.filter(rowMapping => !(rowMapping.supplier || rowMapping.ignore));
        const discardedRowMappings = rowMappings.filter(rowMapping => rowMapping.ignore);
        return <Fragment key="supplierProductUploadMapping">
            {showModal && <SupplierModal
                supplierModalOpen={showModal}
                supplierToEdit={supplier}
                componentKey={NEW_ELEMENT_ID}
                saveSupplier={saveSupplier}
                closeSupplierModal={this.handleCloseModal}
            />}
            <section key="mappingData" className="row" id="mappingData">

                {unResolvedRowMappings.map((mapping, index) =>
                    <div key={`mapping${index}`}
                         className="rounded"
                         draggable={true}
                         onDragStart={event => this.pickUpField(event, mapping.rowIndex)}
                    >
                        {mapping.supplierName}
                        <Icon id={`delete-field${index}`} name="trash"
                              onClick={() => this.discardData(mapping.rowIndex)}
                              title="Discard data"/>
                        <Icon id={`create{index}`} name="add circle"
                              onClick={() => this.setUpSupplierModalForNewField(mapping)}
                              title="Create Part Type to store data"/>
                    </div>
                )}
                {discardedRowMappings.map((mapping, index) =>
                    <div key={`discard${index}`}
                         className="rounded discarded"
                    >
                        {mapping.supplierName}
                        <Icon id={`restore-field${index}`} name="remove circle"
                              onClick={() => this.undoDiscardData(mapping.rowIndex)}
                              title="Do not Discard data"/>
                    </div>
                )}

            </section>
            <div><Button
                key="uploadCont"
                onClick={this.goToNextStep}
                disabled={unResolvedRowMappings.length > 0}
            >
                Continue ...
            </Button></div>
        </Fragment>;
    }
}


export default UploadMappingSuppliers;