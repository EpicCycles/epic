/* eslint-disable import/no-extraneous-dependencies */
import {configure, shallow, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configure({adapter: new Adapter()});

global.shallow = shallow;
global.mount = mount;
global.render = render;

