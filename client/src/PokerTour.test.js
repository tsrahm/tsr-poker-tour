import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PokerTour from './PokerTour';

configure({ adapter: new Adapter() });

describe('<PokerTour />', () => {
	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<PokerTour />, div);
	  ReactDOM.unmountComponentAtNode(div);
	});

	it('should render two buttons and the add player container when action is adding', () => {
    const wrapper = shallow(<PokerTour />);

    wrapper.find('button').simulate('click');

    expect(wrapper.find('.add-player-row')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(2);
  });

  it('should render four inputs when action is editing', () => {
  	const mockData = [{
  		firstName: 'Tory',
      lastName: 'Rahm',
      winnings: '2.3',
      country: 'USA',
      _id: '12'
  	}];
	  const wrapper = shallow(<PokerTour />);

	  wrapper.setState({ data: mockData });
    wrapper.find('.player-row').simulate('click');

    expect(wrapper.find('input')).toHaveLength(4);
  });
});
