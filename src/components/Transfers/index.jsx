/*
eslint

no-return-assign: 0,
*/

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import Transfer from '../Transfer';

class Transfers extends PureComponent {
  static propTypes = {
    transfers: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const { transfers } = this.props;

    return (
      <Row>
        {
          transfers.map(transfer => <Transfer key={transfer.id} number={transfer.id} />)
        }
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
