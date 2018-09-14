/*
eslint

no-return-assign: 0,
*/

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import { TransitionGroup, Transition } from 'react-transition-group';

import Transfer from '../Transfer';

class Transfers extends PureComponent {
  static propTypes = {
    transfers: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  Enter() {
    console.log('Enter');
  }

  Exit() {
    console.log('Exit');
  }

  render() {
    const { transfers } = this.props;

    return (
      <Row>
        <TransitionGroup component={null}>
          {
            transfers.map(transfer => (
              <Transition
                key={transfer.id}
                timeout={500}
                onEntered={this.Enter()}
                onExiting={this.Exit()}
                mountOnEnter
              >
                <Transfer number={transfer.id} />
              </Transition>
            ))
          }
        </TransitionGroup>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
