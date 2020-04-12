import * as React from 'react'
import { connect } from 'react-redux'
import { animated, useTransition } from 'react-spring'

import Transfer from '../Transfer'
import { slideUp } from '../../transition'

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
  const transitions = useTransition(transfers, (transfer) => transfer.id, {
    ...slideUp,
  })

  return (
    <>
      {
        transitions.map(({ item, props }) => (
          <animated.div
            style={props}
            className="w-100"
            key={item.id}
          >
            <Transfer number={item.id} />
          </animated.div>
        ))
      }
    </>
  )
}

const mapStateToProps = (state: State) => ({
  transfers: state.transfer.transfers,
})

export default connect(mapStateToProps)(Transfers)
