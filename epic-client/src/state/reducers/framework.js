import {
    FRAMEWORK,
    FRAMEWORK_ERROR,
    FRAMEWORK_REQUESTED,
    FRAMEWORK_SAVE,
    FRAMEWORK_SAVE_ERROR,
    FRAMEWORK_SAVE_REQUESTED
} from "../actions/framework";
import {CLEAR_ALL_STATE} from "../actions/application";

// const initialState = {
//     isLoading: false,
//     sections: [],
// };
const initialState = {
            isLoading: false,
        sections: [
            {
                id: 1,
                name: 'Frameset',
                placing: 1,
                partTypes: [
                    {
                        id: 1,
                        attributes: [
                            {
                                id: 1,
                                attribute_name: 'Size',
                                in_use: true,
                                mandatory: true,
                                placing: 1,
                                attribute_type: '1',
                                partType: 1
                            }
                        ],
                        shortName: 'Frame',
                        description: null,
                        placing: 1,
                        can_be_substituted: true,
                        can_be_omitted: false,
                        customer_facing: false,
                        includeInSection: 1
                    },
                    {
                        id: 2,
                        attributes: [],
                        shortName: 'Fork',
                        description: null,
                        placing: 2,
                        can_be_substituted: false,
                        can_be_omitted: true,
                        customer_facing: false,
                        includeInSection: 1
                    },
                    {
                        id: 3,
                        attributes: [],
                        shortName: 'Headset',
                        description: null,
                        placing: 3,
                        can_be_substituted: false,
                        can_be_omitted: false,
                        customer_facing: true,
                        includeInSection: 1
                    }
                ]
            },
            {
                id: 2,
                name: 'Wheelset',
                placing: 1,
                partTypes: [
                    {
                        id: 1,
                        attributes: [
                            {
                                id: 1,
                                attribute_name: 'Size',
                                in_use: true,
                                mandatory: true,
                                placing: 1,
                                attribute_type: '1',
                                partType: 1
                            }
                        ],
                        shortName: 'Frame',
                        description: null,
                        placing: 1,
                        can_be_substituted: true,
                        can_be_omitted: false,
                        customer_facing: false,
                        includeInSection: 1
                    },
                    {
                        id: 2,
                        attributes: [],
                        shortName: 'Fork',
                        description: null,
                        placing: 2,
                        can_be_substituted: false,
                        can_be_omitted: true,
                        customer_facing: false,
                        includeInSection: 1
                    },
                    {
                        id: 3,
                        attributes: [],
                        shortName: 'Headset',
                        description: null,
                        placing: 3,
                        can_be_substituted: false,
                        can_be_omitted: false,
                        customer_facing: true,
                        includeInSection: 1
                    }
                ]
            }
        ]
};

// this seemd to be the bit that is in reducers in loyalty code
const framework = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
            return initialState;
        case FRAMEWORK_REQUESTED:
            return {
                ...state,
                isLoading: true,
                sections: [],
            };
        case FRAMEWORK_SAVE_REQUESTED:
            return {
                ...state,
                sections: action.payload.sections,
                isLoading: true,
            };

        case FRAMEWORK_ERROR:
        case FRAMEWORK_SAVE_ERROR:
            return {
                ...state,
                isLoading: false,
            };

        case FRAMEWORK:
        case FRAMEWORK_SAVE:
            return {
                ...state,
                sections: action.payload,
                isLoading: !state.isLoading,
            };
        default:
            return state;
    }
};


export default framework;