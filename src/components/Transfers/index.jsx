/*
eslint

no-return-assign: 0,
*/

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Transition, animated, config } from 'react-spring';

import Transfer from '../Transfer';
import { slideUp } from '../../transition';

function Transfers({ transfers }) {
  return (
    <Transition
      items={transfers}
      keys={item => item.id}
      from={slideUp.from}
      enter={slideUp.enter}
      leave={slideUp.leave}
    >
      {item => styles => (
        <animated.div style={styles} config={config.default} className="w-100 my-3">
          <Transfer number={item.id} />
        </animated.div>
      )}
    </Transition>
  );
}

Transfers.propTypes = {
  transfers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
