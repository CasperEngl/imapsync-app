import * as React from 'react';
import { connect } from 'react-redux';
import { Transition, animated } from 'react-spring';

import Transfer from '../Transfer';
import { slideUp } from '../../transition';

type Transfer = {
  id: number;
};

interface State {
  transfer: Props;
}

interface Props {
  transfers?: Transfer[];
}

function Transfers({ transfers }: Props) {
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
