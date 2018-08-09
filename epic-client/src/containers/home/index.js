import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from "react-router-dom";

const Home = props => (
    <div>
        <h1>Epic Cycles</h1>
        <ul>
            <li>
                <p className="">Customer</p>
                <div className="">
                    <div className="">Customer</div>
                    <Link className="" to="/customer-search">Find Customer</Link>
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
