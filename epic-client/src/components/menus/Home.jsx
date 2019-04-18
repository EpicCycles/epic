import React from 'react'
import MenuSection from "./MenuSection";
import {menuStructure} from "./helpers/menu";

class Home  extends React.Component {
    componentDidMount() {
        this.props.clearAllState();
    }
    render() {
        return <div className=" full content">
            <h1>Epic Cycles</h1>
            <section className='row full content'>
                {menuStructure.map(menuSection => {
                    return <div
                        key={'menuCol' + menuSection.sectionPos}
                        className='column'
                        style={{ width: ((window.innerWidth * 0.8) / menuStructure.length) + "px" }}
                    >
                        <MenuSection
                            sectionPos={menuSection.sectionPos}
                            sectionContents={menuSection.sectionContents}
                        />
                    </div>;
                })}
            </section>
        </div>
    }
}
export default Home;