import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import PokerTour from './PokerTour';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<PokerTour />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

describe('<PokerTour />', () => {
	it('should render two buttons and the add player container when action is adding', () => {
    const wrapper = shallow(<PokerTour />);

    wrapper.find('button').simulate('click');

    expect(wrapper.find('.add-player-row')).toHaveLength(1);
  });
});
