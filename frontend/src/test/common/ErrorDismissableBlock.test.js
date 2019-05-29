import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ErrorDismissibleBlock from '../../common/ErrorDismissibleBlock';

describe('ErrorDismissibleBlock tests', () => {
  it('renders the errorDismissableBlock correctly', () => {
    const application = { message: 'show me the error', messageType: 'E' };
    const errorDismissibleBlock = shallow(
      <ErrorDismissibleBlock application={application} removeMessage={() => {}} />,
    );
    expect(toJson(errorDismissibleBlock)).toMatchSnapshot();
  });
});
