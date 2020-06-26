import * as React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { animated, useTransition } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Row, Col } from 'reactstrap'

import { lockTransfers } from '../../actions/transfer'
import { addLog, removeLog } from '../../actions/process'
import { slideUp } from '../../transition'

declare global {
  interface Window {
    require: any;
  }
}

const { ipcRenderer } = window.require('electron')

interface Log {
  encoded?: string;
  date?: string;
  email?: string[];
}

interface Process {
  logs: Log[];
}

interface State {
  process: Process;
}

interface Props {
  lockTransfers(lock?: boolean): void;
  addLog(log: Log): void;
  removeLog(log: Log): void;
  logs?: Log[];
}

function Logs({
  logs, lockTransfers, addLog, removeLog,
}: Props) {
  const transitions = useTransition(logs, (log) => log.date, {
    ...slideUp,
  })

  function listener(event: any, log: Log) {
    lockTransfers(false)
    addLog(log)
  }

  function remove(log: Log) {
    removeLog(log)
  }

  React.useEffect(() => {
    ipcRenderer.on('command-log', listener)

    return () => {
      ipcRenderer.removeListener('command-log', listener)
    }
  })

  if (!logs) {
    return null
  }

  return (
    <Row>
      {transitions.map(({ item, props }) => (
        <animated.div
          style={props}
          className="col-12"
          key={item.date}
        >
          <Row className="my-1">
            <Col>
              <Button
                color="primary"
                tag="a"
                href={`data:application/octet-stream;charset=utf-16le;base64,${item.encoded}`}
                download={`imapsync_log-${item.email}-${item.date}.txt`}
                className="w-100"
              >
                {`Download ${item.email.join(' -> ')} log`}
              </Button>
            </Col>
            <Col xs="auto" className="pl-0">
              <Button color="warning" onClick={() => remove(item)}>
                <FontAwesomeIcon icon="times" />
              </Button>
            </Col>
          </Row>
        </animated.div>
      ))}
    </Row>
  )
}

const mapStateToProps = (state: State) => ({
  logs: state.process.logs,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  {
    lockTransfers,
    addLog,
    removeLog,
  },
  dispatch,
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logs)
