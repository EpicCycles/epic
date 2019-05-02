import React, {Fragment} from 'react'
import * as PropTypes from "prop-types";
import CustomerListAndSearch from "../customer/CustomerListAndSearch";
import CustomerEdit from "../customer/CustomerEdit";

const initialState = {
    mode: 'find',
};
class QuoteCustomer extends React.Component {
    state = initialState;

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ mode: 'customer' });
    };

    goToEditCustomer = (customerId) => {
        this.props.getCustomer(customerId);
        this.setState({ mode: 'customer' });
    };
    render() {
            const { mode } = this.state;
         const {
             getCustomerList,
             getCustomerListPage,
             isLoading,
             customers,
             customerId,
              addresses,
             phones,
             count,
             next,
             previous,
             searchParams,
             deleteCustomer,
             deleteNote,
             saveNote,
             createNote,
            deleteCustomerPhone, saveCustomerPhone,
            saveCustomerAddress, deleteCustomerAddress,
            saveCustomer, createCustomer
         } = this.props;
    return <Fragment>
            {(mode === 'find') && <CustomerListAndSearch
                    addNewCustomer={this.goToAddCustomer}
                    getCustomerList={getCustomerList}
                    getCustomerListPage={getCustomerListPage}
                    getCustomer={this.goToEditCustomer}
                    searchParams={searchParams}
                    isLoading={isLoading}
                    customers={customers}
                    count={count}
                    next={next}
                    previous={previous}
                />}
        {(mode === 'customer') && <CustomerEdit
            addresses={addresses}
            phones={phones}
            customers={customers}
            deleteCustomer={deleteCustomer}
            isLoading={isLoading}
            customerId={customerId}
            deleteNote={deleteNote}
            saveNote={saveNote}
            createNote={createNote}
            deleteCustomerPhone={deleteCustomerPhone}
            saveCustomerPhone={saveCustomerPhone}
            saveCustomerAddress={saveCustomerAddress}
            deleteCustomerAddress={deleteCustomerAddress}
            saveCustomer={saveCustomer}
            createCustomer={createCustomer}
        />
        }
        </Fragment>
    }
}
QuoteCustomer.defaultProps = {
    count: 0,
};
QuoteCustomer.propTypes = {
    clearCustomerState: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    getCustomerListPage: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
    saveCustomer: PropTypes.func.isRequired,
    createCustomer: PropTypes.func.isRequired,
    searchParams: PropTypes.object,
    isLoading: PropTypes.bool,
    customers: PropTypes.array,
    addresses: PropTypes.array,
    phones: PropTypes.array,
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    next: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    previous: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    deleteCustomerAddress: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    deleteCustomerPhone: PropTypes.func.isRequired,
    saveCustomerPhone: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    saveNote: PropTypes.func.isRequired,
    createNote: PropTypes.func.isRequired,
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
export default QuoteCustomer;