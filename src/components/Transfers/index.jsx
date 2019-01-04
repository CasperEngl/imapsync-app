/*
eslint

no-return-assign: 0,
*/

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';

import Transfer from '../Transfer';

const StyledCol = styled(Col)`
  margin: 1.5rem 0 0;
  padding: 0 15px;
  flex: 0 0 100%;
  width: 100%;

  @media (min-width: 576px) {
    flex: 0 0 calc(100% / 2);
    width: calc(100% / 2);
  }

  @media (min-width: 768px) {
    
  }

  @media (min-width: 992px) {

  }
`;

class Transfers extends PureComponent {
  static propTypes = {
    transfers: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.transferRef = React.createRef();
  }

  render() {
    const { transfers } = this.props;

    return (
      <Row>
        {
          transfers.map(transfer => (
            <StyledCol key={transfer.id}>
              <Transfer number={transfer.id} />
            </StyledCol>
          ))
        }
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
