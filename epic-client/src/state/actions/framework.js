export const FRAMEWORK_REQUESTED = 'framework/FRAMEWORK_REQUESTED';
export const FRAMEWORK_ERROR = 'framework/FRAMEWORK_ERROR';
export const FRAMEWORK = 'framework/FRAMEWORK';
export const FRAMEWORK_SAVE_REQUESTED = 'framework/FRAMEWORK_SAVE_REQUESTED';
export const FRAMEWORK_SAVE_ERROR = 'framework/FRAMEWORK_SAVE_ERROR';
export const FRAMEWORK_SAVE = 'framework/FRAMEWORK_SAVE';
export const FRAMEWORK_UPDATE = 'framework/FRAMEWORK_UPDATE';

export const getFramework =  ()  => ({
    type: FRAMEWORK_REQUESTED,
    payload: { }
});

export const getFrameworkSuccess = sections => ({
    type: FRAMEWORK,
    payload: sections
});

export const getFrameworkFailure = error => ({
    type: FRAMEWORK_ERROR,
    payload: error
});

export const saveFramework =  sections  => ({
    type: FRAMEWORK_SAVE_REQUESTED,
    payload: { sections }
});

export const saveFrameworkSuccess = sections => ({
    type: FRAMEWORK_SAVE,
    payload: sections
});

export const saveFrameworkFailure = error => ({
    type: FRAMEWORK_SAVE_ERROR,
    payload: error
});

export const updateFramework = sections => ({
    type: FRAMEWORK_UPDATE,
    payload: sections
});
