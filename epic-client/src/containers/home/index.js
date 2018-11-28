import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {menuStructure} from "../../helpers/constants";
import MenuSection from "../../components/menus/MenuSection";

const Home = props => (
    <div className=" full content">
        <h1>Epic Cycles</h1>
        <section className='row full content'>
            {menuStructure.map(menuSection => {
                return <div
                    key={'menuCol' + menuSection.sectionPos}
                    className='column'
                    style={{width: ((window.innerWidth * 0.8) / menuStructure.length) + "px"}}
                >
                    <MenuSection
                        sectionPos={menuSection.sectionPos}
                        sectionContents={menuSection.sectionContents}
                    />
                </div>;
            })}
        </section>
    </div>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
