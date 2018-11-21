import React from 'react';
import createHistory from "history/createBrowserHistory";
import App from "../../../containers/app/AppContainer";

describe("App.index tests", () => {
    it('renders the App correctly when the user is not logged in', () => {
        const history = createHistory();
        const state = {};
        history.push('/');
        const app = shallow(<App history={history} state={state} />);
        expect(app).toMatchSnapshot();
    });
    it('renders the App correctly when the user is logged in', () => {
        const history = createHistory();
        const state = {
            user: {
                isAuthenticated: true
            }
        };

        history.push('/');
        const app = shallow(<App history={history} state={state}  />);
        expect(app).toMatchSnapshot();
    });
});
