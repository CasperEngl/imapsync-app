import * as React from 'react';
import { connect } from 'react-redux';
import { Transition, animated } from 'react-spring';

import Transfer from '../Transfer';
import { slideUp } from '../../transition';

type Transfer = {
  id: number;
}

interface ITransfer {
  transfers?: Transfer[];
}

interface State {
  transfer: ITransfer;
}

interface Props extends State {
  transfers?: Transfer[];
}

function Transfers(props: Props) {
  const { transfers } = props;

  return (
    <Transition
      items={transfers}
      keys={(item: Transfer) => item.id}
      from={slideUp.from}
      enter={slideUp.enter}
      leave={slideUp.leave}
    >
      {(item: Transfer) => (styles: any) => (
        <animated.div style={styles} className="w-100 my-3">
          <Transfer number={item.id} />
        </animated.div>
      )}
    </Transition>
  );
}

const mapStateToProps = (state: State) => ({
  transfers: state.transfer.transfers,
});

export default connect(mapStateToProps)(Transfers);
