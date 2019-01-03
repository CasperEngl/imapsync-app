/*
eslint

no-return-assign: 0,
*/

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { tween } from 'popmotion';
import posed, { PoseGroup } from 'react-pose';
import { Row } from 'reactstrap';
import styled from 'styled-components';

import Transfer from '../Transfer';

const PosedDiv = posed.div({
  enter: {
    opacity: 1,
    y: '0rem',
    transition: {
      delay: 250,
      duration: 700,
    },
  },
  exit: {
    opacity: 0,
    y: '1rem',
    transition: {
      duration: 300,
    },
  },
  flip: {
    transition: tween,
  },
});

const StyledCol = styled(PosedDiv)`
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
        <PoseGroup animateOnMount enterPose="enter" preEnterPose="exit">
          {
            transfers.map(transfer => (
              <StyledCol key={transfer.id}>
                <Transfer number={transfer.id} />
              </StyledCol>
            ))
          }
        </PoseGroup>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
