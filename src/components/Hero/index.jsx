/*
eslint

class-methods-use-this: 0,
*/

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Jumbotron,
  FormGroup,
  Input,
  ButtonGroup,
  Button,
} from 'reactstrap';
import styled from 'styled-components';
import { Transition, config, animated } from 'react-spring';
import parseColor from 'parse-color';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { compileTransfers } from '../../actions/UserActions';
import { slideUp } from '../../transition';

const { ipcRenderer } = window.require('electron');

const OutputWindow = styled(PerfectScrollbar)`
  padding: 1rem;
  margin-bottom: 1rem;
  height: 300px;
  font-family: monospace;
  font-weight: 700;
`;

class Hero extends PureComponent {
  static propTypes = {
    command: PropTypes.string.isRequired,
    commandJson: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired)).isRequired,
    compileTransfers: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.execute = this.execute.bind(this);
    this.stdoutListener = this.stdoutListener.bind(this);
    this.stderrListener = this.stderrListener.bind(this);
    this.logListener = this.logListener.bind(this);
    this.pidListener = this.pidListener.bind(this);
    this.exitListener = this.exitListener.bind(this);
    this.outputScrollBottom = this.outputScrollBottom.bind(this);
    this.reset = this.reset.bind(this);
    this.cancel = this.cancel.bind(this);
    this.outputLog = React.createRef();

    this.state = {
      output: '',
      logs: [],
      pids: [],
      disabled: false,
      preferences: {},
      outputBg: '#343a40',
      outputColor: 'rgba(255, 255, 255, 0.75)',
    };
  }

  componentDidMount() {
    // ipcRenderer.on('command-stdout', this.stdoutListener);
    ipcRenderer.on('command-stdout', this.stdoutListener);
    ipcRenderer.on('command-stderr', this.stderrListener);
    ipcRenderer.on('command-log', this.logListener);
    ipcRenderer.on('command-pid', this.pidListener);
    ipcRenderer.on('command-exit', this.exitListener);

    const preferences = ipcRenderer.sendSync('getPreferences');

    if (preferences) {
      const { output_bg: opBg, output_color: opColor } = preferences.settings;

      const outputBg = parseColor(opBg);
      const outputColor = parseColor(opColor);

      this.setState(prevState => ({
        ...prevState,
        preferences,
        outputBg: outputBg.rgba ? `rgba(${outputBg.rgba.join(', ')})` : prevState.outputBg,
        outputColor: outputColor.rgba ? `rgba(${outputColor.rgba.join(', ')})` : prevState.outputColor,
      }));
    }

    this.outputScrollBottom(this.outputLog.current);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-stdout', this.stdoutListener);
    ipcRenderer.removeListener('command-stderr', this.stderrListener);
    ipcRenderer.removeListener('command-log', this.logListener);
    ipcRenderer.removeListener('command-pid', this.pidListener);
    ipcRenderer.removeListener('command-exit', this.exitListener);
  }

  stdoutListener(event, stdout) {
    this.setState((prevState) => {
      const shortened = prevState.output
        .split(/\r\n|\r|\n/)
        .splice(prevState.output.split(/\r\n|\r|\n/).length - 200)
        .join('\n');

      return {
        output: shortened + stdout,
      };
    });

    this.outputScrollBottom();
  }

  stderrListener() {
    this.outputScrollBottom();
  }

  logListener(event, log) {
    this.setState(prevState => ({
      disabled: false,
      logs: [
        ...prevState.logs,
        log,
      ],
    }));
  }

  pidListener(event, pid) {
    this.setState(prevState => ({
      disabled: true,
      pids: [
        ...prevState.pids,
        pid,
      ],
    }));
  }

  exitListener(event, pid) {
    this.setState(prevState => ({
      disabled: false,
      pids: prevState.pids.filter(obj => obj.pid !== pid),
    }));
  }

  async execute() {
    const { compileTransfers, commandJson } = this.props;

    await compileTransfers();

    if (commandJson.length) {
      ipcRenderer.send('command', commandJson);
    }
  }

  async cancel(pid) {
    const { compileTransfers } = this.props;

    await compileTransfers();

    this.setState(prevState => ({
      pids: prevState.pids.filter(obj => obj.pid !== pid),
    }));

    ipcRenderer.send('command-cancelled', pid);
  }

  reset() {
    this.setState({
      output: '',
      logs: [],
      pids: [],
    });
  }

  outputScrollBottom() {
    this.outputLog.scrollTop = this.outputLog.scrollHeight;
  }

  render() {
    const { command } = this.props;
    const {
      output,
      logs,
      pids,
      disabled,
      outputBg,
      outputColor,
    } = this.state;

    return (
      <Jumbotron className="hero mt-4 pb-3 overflow-hidden">
        <Container>
          <FormGroup>
            <Input
              type="text"
              placeholder="./imapsync_bin --host1 '127.0.0.1' --user1 'user@domain.com' --host2 '127.0.0.1' --user2 'user@domain.com';"
              value={command}
              style={{
                backgroundColor: outputBg,
                color: outputColor,
              }}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <OutputWindow
              containerRef={ref => this.outputLog = ref} //eslint-disable-line 
              className="shadow-lg"
              style={{
                backgroundColor: outputBg,
              }}
            >
              <pre
                className="overflow-hidden"
                style={{
                  color: outputColor,
                }}
              >
                {output}
              </pre>
            </OutputWindow>
            <ButtonGroup>
              <Button color="primary" onClick={this.execute} disabled={disabled}>Execute</Button>
              <Button color="warning" onClick={this.reset} disabled={disabled}>Reset</Button>
            </ButtonGroup>
          </FormGroup>
          <div className="bg-white p-4 border-radius-sm" style={{ margin: '0 -1.5rem' }}>
            <Transition
              items={pids}
              keys={item => item.pid}
              from={slideUp.from}
              enter={slideUp.enter}
              leave={slideUp.leave}
            >
              {item => styles => (
                <animated.div
                  style={styles}
                  config={config.default}
                  className="btn btn-warning w-100 my-2"
                  onClick={() => this.cancel(item.pid)}
                >
                  Cancel
                  {' '}
                  {item.email}
                </animated.div>
              )}
            </Transition>
            <Transition
              items={logs}
              keys={item => item.date}
              from={slideUp.from}
              enter={slideUp.enter}
              leave={slideUp.leave}
            >
              {item => styles => (
                <animated.div
                  style={styles}
                  config={config.default}
                  className="w-100 my-2"
                >
                  <div className="download">
                    <a
                      href={`data:application/octet-stream;charset=utf-16le;base64,${item.encoded}`}
                      download={`imapsync_log-${item.email}-${item.date}.txt`}
                      className="font-weight-bold"
                    >
                      {`Download ${item.email} log`}
                    </a>
                  </div>
                </animated.div>
              )}
            </Transition>
          </div>
        </Container>
      </Jumbotron>
    );
  }
}

const mapStateToProps = state => ({
  command: state.compiler.command.text,
  commandJson: state.compiler.command.json,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  compileTransfers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Hero);
