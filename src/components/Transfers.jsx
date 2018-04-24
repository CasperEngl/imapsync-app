import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Transfer from './Transfer';

class Transfers extends PureComponent {
  static propTypes = {
    transfers: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const { transfers } = this.props;

    return (
      <Fragment>
        {transfers &&
        transfers.map(transfer =>
          <Transfer key={transfer.id} number={transfer.id} />,
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
