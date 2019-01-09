/*
eslint

class-methods-use-this: 0,
*/

import React, { PureComponent } from 'react';
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

const { ipcRenderer } = window.require('electron');

const OutputWindow = styled.textarea`
  height: 300px;
  width: 100%;
  background: #222;
  resize: none;
  font-family: monospace;
  font-weight: 700;
  color: white;
`;

class Hero extends PureComponent {
  static propTypes = {
    command: PropTypes.string.isRequired,
    commandJson: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired)).isRequired,
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
    };
  }

  componentDidMount() {
    // ipcRenderer.on('command-stdout', this.stdoutListener);
    ipcRenderer.on('command-stdout', this.stdoutListener);
    ipcRenderer.on('command-stderr', this.stderrListener);
    ipcRenderer.on('command-log', this.logListener);

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

  execute() {
    const { commandJson } = this.props;

    ipcRenderer.send('command', commandJson);
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
    const { output, logs } = this.state;

    return (
      <Jumbotron className="mt-4">
        <Container>
          <h1>IMAP SYNC</h1>
          <FormGroup>
            <Input type="text" placeholder="Script will appear here" value={command} readOnly />
          </FormGroup>
          <FormGroup>
            <OutputWindow value={output} ref={this.outputLog} readOnly />
            <ButtonGroup>
              <Button color="primary" onClick={this.execute}>Execute</Button>
              <Button color="warning" onClick={this.reset}>Reset</Button>
            </ButtonGroup>
            {
              logs.map(log => (
                <a href={`data:application/octet-stream;charset=utf-16le;base64,${log.encoded}`} download={`imapsync_log-${log.date}.txt`}>
                  Download
                  {' '}
                  {log.date}
                </a>
              ))
            }
          </FormGroup>
        </Container>
      </Jumbotron>
    );
  }
}

const mapStateToProps = state => ({
  command: state.compiler.command.text,
  commandJson: state.compiler.command.json,
});

export default connect(mapStateToProps)(Hero);
