import React from "react";
import SearchButton from "../../common/SearchButton";

describe('SearchButton', () => {
   it('should call passed function when not disabled and clicked', () => {
       const onClick = jest.fn();
       const component = shallow(<SearchButton
           onClick={onClick}
       />);
       expect(component.find('Icon')).toHaveLength(1);
       component.find('Icon').simulate('click');
       expect(onClick).toHaveBeenCalled();
   });
   it('should not call passed function when disabled and clicked', () => {
       const onClick = jest.fn();
       const component = shallow(<SearchButton
           onClick={onClick}
           disabled={true}
       />);
       expect(component.find('Icon')).toHaveLength(1);
       component.find('Icon').simulate('click');
       expect(onClick).not.toHaveBeenCalled();
   });
});