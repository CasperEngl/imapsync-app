declare global {
  interface Window {
    require: any;
  }
}

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Transition, animated } from 'react-spring';
import { Row, Col, Button } from 'reactstrap';

import { lockTransfers, setCancelled } from '../../actions/transfer';
import { addPid, removePid, clearPids } from '../../actions/process';
import { slideUp } from '../../transition';

import { compileTransfers } from '../../actions/compiler';
import { store } from '../../App';

const { ipcRenderer } = window.require('electron');

interface Pid {
  email: string;
  pid: number;
}

interface Process {
  pids: Pid[];
}

interface State {
  process: Process;
}

interface Props {
  pids?: Pid[];
  lockTransfers(lock?: boolean): void;
  addPid(pid: Pid): void;
  removePid(pid: Pid): void;
  clearPids(): void;
  compileTransfers(): void;
  setCancelled(cancelled: boolean): void;
}

function Pids({
  pids,
  lockTransfers,
  addPid,
  removePid,
  clearPids,
  compileTransfers,
  setCancelled,
}: Props) {
  function listener(event: any, pid: Pid) {
    lockTransfers(true);
    addPid(pid);
  }
  
  function exitListener(event: any, pid: Pid) {  
    lockTransfers(false);
    removePid(pid);
  }

  async function cancel(pid: number) {
    setCancelled(true);

    await compileTransfers();

    ipcRenderer.send('command-cancelled', pid);
  }

  React.useEffect(() => {
    ipcRenderer.on('command-pid', listener);
    ipcRenderer.on('command-exit', exitListener);
    
    return () => {
      ipcRenderer.removeListener('command-pid', listener);
      ipcRenderer.removeListener('command-exit', exitListener);
    }
  }, [pids]);

  React.useEffect(() => {
    clearPids();

    return () => clearPids();
  }, []);

  if (!pids) {
    return null;
  }
  
  return (
    <Row>
      <Transition
        items={pids}
        keys={(item: any) => item.pid}
        from={slideUp.from}
        enter={slideUp.enter}
        leave={slideUp.leave}
      >
        {(item: Pid) => (styles: any) => {
          if (!item.pid) {
            return null;
          }

          return (
            <animated.div
              style={styles}
              className="col-12"
              key={item.pid}
            >
              <Row className="my-2">
                <Col>
                  <Button
                    color="warning"
                    onClick={() => cancel(item.pid)}
                    className="w-100"
                  >
                    Cancel {item.email}
                  </Button>
                </Col>
              </Row>
            </animated.div>
          )
        }}
      </Transition>
    </Row>
  )
}

const mapStateToProps = (state: State) => ({
  pids: state.process.pids,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  lockTransfers,
  compileTransfers,
  addPid,
  removePid,
  clearPids,
  setCancelled,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Pids);