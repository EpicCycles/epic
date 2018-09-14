export const FRAMEWORK_REQUESTED = 'customer/FRAMEWORK_REQUESTED';
export const FRAMEWORK_ERROR = 'customer/FRAMEWORK_ERROR';
export const FRAMEWORK = 'customer/FRAMEWORK';
export const FRAMEWORK_SAVE_REQUESTED = 'customer/FRAMEWORK_SAVE_REQUESTED';
export const FRAMEWORK_SAVE_ERROR = 'customer/FRAMEWORK_SAVE_ERROR';
export const FRAMEWORK_SAVE = 'customer/FRAMEWORK_SAVE';

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

export const savetFramework =  sections  => ({
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
