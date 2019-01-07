/*
eslint

no-return-assign: 0,
*/

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Transition, animated, config } from 'react-spring';

import Transfer from '../Transfer';

class Transfers extends PureComponent {
  static propTypes = {
    transfers: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const { transfers } = this.props;

    const transition = {
      from: {
        transform: 'translate3d(0, 40px, 0)',
        opacity: 0,
        height: 0,
      },
      enter: [
        {
          transform: 'translate3d(0, 0, 0)',
          opacity: 1,
          height: 'auto',
        },
      ],
      leave: [
        {
          transform: 'translate3d(0, 40px, 0)',
          opacity: 0,
          height: 0,
        },
      ],
    };

    return (
      <Transition
        items={transfers}
        keys={item => item.id}
        from={transition.from}
        enter={transition.enter}
        leave={transition.leave}
      >
        {item => styles => (
          <animated.div style={styles} config={config.default} className="w-100 my-3">
            <Transfer number={item.id} />
          </animated.div>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
