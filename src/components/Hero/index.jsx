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

import { compileTransfers } from '../../actions/UserActions';
import { slideUp } from '../../transition';

const { ipcRenderer } = window.require('electron');

const OutputWindow = styled.textarea`
  padding: 1rem;
  height: 300px;
  width: 100%;
  resize: none;
  font-family: monospace;
  font-weight: 700;
  color: white;
  box-shadow: none;
  outline: none;
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
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.reset = this.reset.bind(this);
    this.outputLog = React.createRef();

    this.state = {
      output: '',
      logs: [],
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

    this.scrollToBottom(this.outputLog.current);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-stdout', this.stdoutListener);
    ipcRenderer.removeListener('command-stderr', this.stderrListener);
  }

  stdoutListener(event, stdout) {
    this.setState(prevState => ({
      output: prevState.output + stdout,
    }));
    this.scrollToBottom(this.outputLog.current);
  }

  stderrListener() {
    this.scrollToBottom(this.outputLog.current);
  }

  logListener(event, log) {
    this.setState(prevState => ({
      logs: [
        ...prevState.logs,
        log,
      ],
    }));
  }

  async execute() {
    const { compileTransfers, commandJson } = this.props;

    await compileTransfers();

    if (commandJson.length) {
      ipcRenderer.send('command', commandJson);
    }
  }

  reset() {
    this.setState({
      output: '',
      logs: [],
    });
  }

  scrollToBottom(element) {
    element.scrollTop = element.scrollHeight; // eslint-disable-line
  }

  render() {
    const { command } = this.props;
    const {
      output,
      logs,
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
              value={output}
              ref={this.outputLog}
              className="border-0 border-radius-sm"
              style={{
                backgroundColor: outputBg,
                color: outputColor,
              }}
              readOnly
            />
            <ButtonGroup>
              <Button color="primary" onClick={this.execute}>Execute</Button>
              <Button color="warning" onClick={this.reset}>Reset</Button>
            </ButtonGroup>
          </FormGroup>
          <div className="bg-white p-4 border-radius-sm" style={{ margin: '0 -1.5rem' }}>
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
