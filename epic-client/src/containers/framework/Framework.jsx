import React, {Fragment} from "react";

class Framework extends React.Component {
    componentWillMount() {
        if (!(this.props.sections && this.props.sections.length > 0)) {
            this.props.getFramework();
        }
    };

    // build an initial display -
    // put a new sequence in place going up by 10 each time,
    // have move up and move down functions adding or subtracting 11 each time
    // have move to top and move to bottom setting to 0 or 99999
    // at each level have an add new element - section or part type
    render() {
        const {
            sections,
            saveFramework
        } = this.props;
        return (
            <div id='framework'>
                <h2>Sections</h2>
                <ul id='sections'>
                    <li id='newSection'>
                        put new sections here
                    </li>
                    {sections && sections.map((section) => {
                        return <li id={`section${section.id}`}>
                            {section.name}
                            <ul id={`partTypes${section.id}`}>
                                <li id='newPartType'>
                                    put new part type here
                                </li>
                                {section.partTypes && section.partTypes.map((partType) => {
                                    return <li id={`partType${partType.id}`}>
                                        {partType.shortName}
                                    </li>
                                })}
                            </ul>
                        </li>
                    })}
                </ul>
            </div>
        );
    }
}
export default Framework;
