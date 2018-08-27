import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from "react-router-dom";

const Home = props => (
    <div>
        <h1>Epic Cycles</h1>
        <ul>
            <li>
                <h2>Customer</h2>
                <div className="">
                    <Link className="internal_link" to="/customer">Add Customer</Link>
                    <Link className="internal_link" to="/customer-search">Find Customer</Link>
                </div>
            </li>
        </ul>
    </div>
)

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
