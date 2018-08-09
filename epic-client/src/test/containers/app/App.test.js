import React from 'react';
import createHistory from "history/createBrowserHistory";
import App from "../../../containers/app";

describe("App.index tests", () => {
    it('renders the App correctly', () => {
        const history = createHistory();
        history.push('/');
        const app = shallow(<App history={history}  />);
        expect(app).toMatchSnapshot();
    });
});
