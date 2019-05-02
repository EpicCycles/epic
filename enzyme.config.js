/* eslint-disable import/no-extraneous-dependencies */

/** Used in jest.config.js */

/* eslint-disable import/no-extraneous-dependencies */
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.render = render;
