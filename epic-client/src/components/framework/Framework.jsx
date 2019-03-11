import React, {Fragment} from "react";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace,
    renumberAll
} from "./helpers/framework";
import SectionEdit from "../section/SectionEdit";
import FrameworkMoves from "./FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import {Prompt} from "react-router";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import {getModelKey} from "../app/model/helpers/model";

class Framework extends React.Component {
    componentWillMount() {
        if (!(this.props.sections && this.props.sections.length > 0)) {
            this.props.getFramework();
        }
    };

    handleSectionChange = (sectionKey, updatedSection) => {
        const sectionsWithUpdates = this.props.sections.slice();
        const sectionToUpdateIndex = findIndexOfObjectWithKey(sectionsWithUpdates, sectionKey);
        if (sectionToUpdateIndex > -1) {
            sectionsWithUpdates[sectionToUpdateIndex] = updatedSection;
        } else {
            sectionsWithUpdates.push(updatedSection);
        }
        this.props.updateFramework(sectionsWithUpdates);
    };
    moveUp = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectUpOnePlace(this.props.sections, sectionKey));
    };
    moveDown = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectDownOnePlace(this.props.sections, sectionKey));
    };
    moveToTop = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectToTop(this.props.sections, sectionKey));
    };
    moveToBottom = (fieldName) => {
        const fields = fieldName.split('_');
        const sectionKey = fields[1];
        this.props.updateFramework(moveObjectToBottom(this.props.sections, sectionKey));
    };
    saveChanges = () => {
        this.props.saveFramework(renumberAll(this.props.sections));
    };

    render() {
        const {
            sections,
            isLoading
        } = this.props;
        const sectionsToUse = sections ? sections.filter(section => !(section.delete || (section.dummyKey === NEW_ELEMENT_ID))) : [];
        const sectionsWithChanges = sections ? sections.filter(section => (section.delete || section.changed)) : [];
        const newSections = sections ? sections.filter(section => (section.dummyKey === NEW_ELEMENT_ID)) : [];
        let newSectionForDisplay = (newSections.length > 0) ? newSections[0] : {};
        const changesExist = sectionsWithChanges.length > 0;
        return <Fragment>
            <Prompt
                when={changesExist}
                message="You have made changes to the framework. Cancel and Save if you do not want to lose them."
            />
            <div key={`sections`} className="grid">
                <div key="sectionsHeaders" className="grid-row grid-row--header">
                    <div className="grid-item--header grid-header--fixed-left" style={{width:"20px"}}>&nbsp;</div>
                    <div className="grid-item--header" style={{width: (window.innerWidth * 0.8) + "px"}}>Section</div>
                    <div className="grid-item--header" style={{width:"110px"}}>Position</div>
                    <div  className="grid-item--header grid-col--fixed-right"><Button onClick={this.saveChanges} disabled={isLoading || !changesExist}>
                        Save
                    </Button></div>
                </div>
                {sectionsToUse.map((section) => {
                    const componentKey = getModelKey(section);
                    const className = section.error ? "error" : "";
                    const rowTitle = section.error ? section.error_detail : "";
                    return (
                        <div
                            key={`section_${componentKey}`}
                            className={`grid-row ${className}`}
                            title={rowTitle}
                        >
                            <SectionEdit
                                key={`sectionEdit${componentKey}`}
                                section={section}
                                componentKey={componentKey}
                                handleSectionChange={this.handleSectionChange}
                            />
                            <div className="grid-item">
                                {sectionsToUse.length > 1 &&
                                <FrameworkMoves
                                    componentKey={componentKey}
                                    moveToTop={this.moveToTop}
                                    moveUp={this.moveUp}
                                    moveDown={this.moveDown}
                                    moveToBottom={this.moveToBottom}
                                />
                                }
                            </div>
                            <div className="grid-col--fixed-right" />
                        </div>
                    );
                })}
                <div
                    key={`section_new`}
                    className="grid-row"
                >
                    <SectionEdit
                        key="sectionEditNew"
                        section={newSectionForDisplay}
                        componentKey={NEW_ELEMENT_ID}
                        handleSectionChange={this.handleSectionChange}
                    />
                    <div className="grid-item" />
                    <div className="grid-col--fixed-right" />
                </div>
            </div>
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }

        </Fragment>;
    }
}

export default Framework;
