declare global {
  interface Window {
    require: any;
  }
}

import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  Container,
  Jumbotron,
  FormGroup,
  Input,
  ButtonGroup,
  Button,
} from 'reactstrap';
import { Transition, animated } from 'react-spring';
import tinycolor from 'tinycolor2';

import OutputWindow from '../OutputWindow';

import { compileTransfers } from '../../actions/compiler';
import { slideUp } from '../../transition';

const { ipcRenderer } = window.require('electron');

interface Log {
  encoded?: string;
  date?: string;
  email?: string;
}

interface Pid {
  email: string;
  pid: number;
}

interface Preferences {
  output_bg?: string;
  output_color?: string;
  documents_directory?: string;
}

interface Command {
  command: Command;
  text: string;
  json: string[];
}

interface State {
  output: string;
  logs: Log[];
  pids: Pid[];
  disabled: boolean;
  preferences: Preferences;
  outputBg: string;
  outputColor: string;
}

interface RState {
  compiler: Command;
}

interface Props {
  command: string;
  commandList: string[];
  compileTransfers(): void;
}

class Hero extends React.PureComponent<Props, State> {
  private outputLog: any;

  public state: State = {
    output: '',
    logs: [],
    pids: [],
    disabled: false,
    preferences: {},
    outputBg: '#343a40',
    outputColor: 'rgba(255, 255, 255, 0.75)',
  }

  constructor(props: Props) {
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
    this.outputLog = React.createRef<any>();
  }

  componentDidMount() {
    ipcRenderer.on('command-stdout', this.stdoutListener);
    ipcRenderer.on('command-stderr', this.stderrListener);
    ipcRenderer.on('command-log', this.logListener);
    ipcRenderer.on('command-pid', this.pidListener);
    ipcRenderer.on('command-exit', this.exitListener);

    const preferences = ipcRenderer.sendSync('getPreferences');

    if (preferences) {
      const { output_bg: opBg, output_color: opColor } = preferences.settings;

      const outputBg = tinycolor(opBg);
      const outputColor = tinycolor(opColor);

      this.setState(prevState => ({
        ...prevState,
        preferences,
        outputBg: outputBg.isValid() ? outputBg.toRgbString() : prevState.outputBg,
        outputColor: outputColor.isValid() ? outputColor.toRgbString() : prevState.outputColor,
      }));
    }

    this.outputScrollBottom();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-stdout', this.stdoutListener);
    ipcRenderer.removeListener('command-stderr', this.stderrListener);
    ipcRenderer.removeListener('command-log', this.logListener);
    ipcRenderer.removeListener('command-pid', this.pidListener);
    ipcRenderer.removeListener('command-exit', this.exitListener);
  }

  stdoutListener(event: any, stdout: string) {
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

  logListener(event: any, log: Log) {
    this.setState(prevState => ({
      disabled: false,
      logs: [
        ...prevState.logs,
        log,
      ],
    }));
  }

  pidListener(event: any, pid: Pid) {
    this.setState(prevState => ({
      disabled: true,
      pids: [
        ...prevState.pids,
        pid,
      ],
    }));
  }

  exitListener(event: any, pid: number) {
    this.setState(prevState => ({
      disabled: false,
      pids: prevState.pids.filter(obj => obj.pid !== pid),
    }));
  }

  async execute() {
    const { compileTransfers, commandList } = this.props;

    await compileTransfers();

    if (commandList.length) {
      ipcRenderer.send('command', commandList);
    }
  }

  async cancel(pid: number) {
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
      <Jumbotron className="hero mt-4 mb-0 pb-3 overflow-hidden">
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
              containerRef={ref => this.outputLog = ref}
              outputBg={outputBg}
              outputColor={outputColor}
              className="shadow-lg"
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
              keys={(item: any) => item.pid}
              from={slideUp.from}
              enter={slideUp.enter}
              leave={slideUp.leave}
            >
              {(item: Pid) => (styles: any) => (
                <animated.div
                  style={styles}
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
              keys={(item: Log) => item.date}
              from={slideUp.from}
              enter={slideUp.enter}
              leave={slideUp.leave}
            >
              {(item: Log) => (styles: any) => (
                <animated.div
                  style={styles}
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

const mapStateToProps = (state: RState) => ({
  command: state.compiler.command.text,
  commandList: state.compiler.command.json,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  compileTransfers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Hero);
