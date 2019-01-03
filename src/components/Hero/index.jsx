/*
eslint

class-methods-use-this: 0,
*/

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container, Jumbotron, FormGroup, Input, Button,
} from 'reactstrap';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { ipcRenderer } = window.require('electron');

const CopyGroup = styled.div`
  display: flex;

  > * {
    border-radius: 0;

    &:first-child {
      border-top-left-radius: .25rem;
      border-bottom-left-radius: .25rem;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:last-child {
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: .25rem;
      border-bottom-right-radius: .25rem;
    }
  }
`;

const OutputWindow = styled.textarea`
  height: 300px;
  width: 100%;
  background: #222;
  resize: none;
  font-family: monospace;
  font-weight: 700;
  color: white;
`;

const text = `
Messages void (noheader) on host2 : 0
Messages deleted on host1         : 0
Messages deleted on host2         : 0
Total bytes transferred           : 0 (0.000 KiB)
Total bytes duplicate host1       : 0 (0.000 KiB)
Total bytes duplicate host2       : 0 (0.000 KiB)
Total bytes skipped               : 0 (0.000 KiB)
Total bytes error                 : 0 (0.000 KiB)
Message rate                      : 0.0 messages/s
Average bandwidth rate            : 0.0 KiB/s
Reconnections to host1            : 0
Reconnections to host2            : 0
Memory consumption at the end     : 4292.1 MiB (started with 4285.7 MiB)

Biggest message                   : 0 bytes (0.000 KiB)
Memory/biggest message ratio      : NA
Start difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Final difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Detected 0 errors

This imapsync is up to date. ( local 1.882 >= official 1.882 )( Use --noreleasecheck to avoid this release check. )
Homepage: https://imapsync.lamiral.info/

# Entering tests_live_result()
Live tests ended successfully
# Leaving  tests_live_result()
Exiting with return value 0
Log file is LOG_imapsync/2019_01_03_15_29_27_496_test1_test2.txt ( to change it, use --logfile filepath ; or use --nolog to turn off logging )

++++ Statistics
Transfer started on               : Thu Jan  3 15:29:27 2019
Transfer ended on                 : Thu Jan  3 15:29:36 2019
Transfer time                     : 8.7 sec
Folders synced                    : 14/14 synced
Messages transferred              : 0 

Messages skipped                  : 0
Messages found duplicate on host1 : 0
Messages found duplicate on host2 : 0
Messages void (noheader) on host1 : 0
Messages void (noheader) on host2 : 0
Messages deleted on host1         : 0
Messages deleted on host2         : 0
Total bytes transferred           : 0 (0.000 KiB)
Total bytes duplicate host1       : 0 (0.000 KiB)

Total bytes duplicate host2       : 0 (0.000 KiB)
Total bytes skipped               : 0 (0.000 KiB)
Total bytes error                 : 0 (0.000 KiB)
Message rate                      : 0.0 messages/s
Average bandwidth rate            : 0.0 KiB/s
Reconnections to host1            : 0
Reconnections to host2            : 0

Memory consumption at the end     : 4292.1 MiB (started with 4285.7 MiB)
Biggest message                   : 0 bytes (0.000 KiB)
Memory/biggest message ratio      : NA
Start difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Final difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Detected 0 errors

This imapsync is up to date. ( local 1.882 >= official 1.882 )( Use --noreleasecheck to avoid this release check. )

Homepage: https://imapsync.lamiral.info/
# Entering tests_live_result()
Live tests ended successfully
# Leaving  tests_live_result()
Exiting with return value 0

Log file is LOG_imapsync/2019_01_03_15_29_27_406_test1_test2.txt ( to change it, use --logfile filepath ; or use --nolog to turn off logging )

++++ Statistics
Transfer started on               : Thu Jan  3 15:29:27 2019
Transfer ended on                 : Thu Jan  3 15:29:36 2019

 Size:         0 Messages:     0 Biggest:         0
Host2 Nb folders:               14 folders
Host2 Nb messages:               0 messages
Host2 Total size:                0 bytes (0.000 KiB)
Host2 Biggest message:           0 bytes (0.000 KiB)
Host2 Time spent:              0.9 seconds

Transfer time                     : 8.6 sec
Folders synced                    : 14/14 synced
Messages transferred              : 0 
Messages skipped                  : 0
Messages found duplicate on host1 : 0
Messages found duplicate on host2 : 0
Messages void (noheader) on host1 : 0
Messages void (noheader) on host2 : 0
Messages deleted on host1         : 0
Messages deleted on host2         : 0

Total bytes transferred           : 0 (0.000 KiB)
Total bytes duplicate host1       : 0 (0.000 KiB)
Total bytes duplicate host2       : 0 (0.000 KiB)
Total bytes skipped               : 0 (0.000 KiB)
Total bytes error                 : 0 (0.000 KiB)
Message rate                      : 0.0 messages/s
Average bandwidth rate            : 0.0 KiB/s
Reconnections to host1            : 0
Reconnections to host2            : 0
Memory consumption at the end     : 4291.1 MiB (started with 4277.7 MiB)
Biggest message                   : 0 bytes (0.000 KiB)
Memory/biggest message ratio      : NA

Start difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Final difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Detected 0 errors

This imapsync is up to date. ( local 1.882 >= official 1.882 )( Use --noreleasecheck to avoid this release check. )
Homepage: https://imapsync.lamiral.info/
# Entering tests_live_result()
Live tests ended successfully
# Leaving  tests_live_result()
Exiting with return value 0
Log file is LOG_imapsync/2019_01_03_15_29_27_536_test1_test2.txt ( to change it, use --logfile filepath ; or use --nolog to turn off logging )

 Size:         0 Messages:     0 Biggest:         0

Host2 folder   12/14 [Sent]                             
++++ Statistics
Transfer started on               : Thu Jan  3 15:29:27 2019
Transfer ended on                 : Thu Jan  3 15:29:36 2019
Transfer time                     : 8.7 sec
Folders synced                    : 14/14 synced
Messages transferred              : 0 

Messages skipped                  : 0
Messages found duplicate on host1 : 0
Messages found duplicate on host2 : 0
Messages void (noheader) on host1 : 0
Messages void (noheader) on host2 : 0
Messages deleted on host1         : 0
Messages deleted on host2         : 0

Total bytes transferred           : 0 (0.000 KiB)
Total bytes duplicate host1       : 0 (0.000 KiB)
Total bytes duplicate host2       : 0 (0.000 KiB)
Total bytes skipped               : 0 (0.000 KiB)
Total bytes error                 : 0 (0.000 KiB)

Message rate                      : 0.0 messages/s
Average bandwidth rate            : 0.0 KiB/s
Reconnections to host1            : 0
Reconnections to host2            : 0
Memory consumption at the end     : 4283.1 MiB (started with 4277.7 MiB)
Biggest message                   : 0 bytes (0.000 KiB)
Memory/biggest message ratio      : NA

Start difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Final difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Detected 0 errors

This imapsync is up to date. ( local 1.882 >= official 1.882 )( Use --noreleasecheck to avoid this release check. )

Homepage: https://imapsync.lamiral.info/

# Entering tests_live_result()
Live tests ended successfully
# Leaving  tests_live_result()

Exiting with return value 0
Log file is LOG_imapsync/2019_01_03_15_29_27_431_test1_test2.txt ( to change it, use --logfile filepath ; or use --nolog to turn off logging )

 Size:         0 Messages:     0 Biggest:         0

Host2 folder   13/14 [Sent Messages]                    
 Size:         0 Messages:     0 Biggest:         0

Host2 folder   14/14 [Trash]                            
 Size:         0 Messages:     0 Biggest:         0

Host2 Nb folders:               14 folders
Host2 Nb messages:               0 messages
Host2 Total size:                0 bytes (0.000 KiB)
Host2 Biggest message:           0 bytes (0.000 KiB)

Host2 Time spent:              0.9 seconds

++++ Statistics
Transfer started on               : Thu Jan  3 15:29:27 2019
Transfer ended on                 : Thu Jan  3 15:29:36 2019
Transfer time                     : 8.9 sec
Folders synced                    : 14/14 synced
Messages transferred              : 0 

Messages skipped                  : 0
Messages found duplicate on host1 : 0
Messages found duplicate on host2 : 0
Messages void (noheader) on host1 : 0
Messages void (noheader) on host2 : 0
Messages deleted on host1         : 0
Messages deleted on host2         : 0

Total bytes transferred           : 0 (0.000 KiB)
Total bytes duplicate host1       : 0 (0.000 KiB)
Total bytes duplicate host2       : 0 (0.000 KiB)
Total bytes skipped               : 0 (0.000 KiB)
Total bytes error                 : 0 (0.000 KiB)

Message rate                      : 0.0 messages/s
Average bandwidth rate            : 0.0 KiB/s
Reconnections to host1            : 0
Reconnections to host2            : 0
Memory consumption at the end     : 4283.1 MiB (started with 4277.7 MiB)
Biggest message                   : 0 bytes (0.000 KiB)
Memory/biggest message ratio      : NA

Start difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Final difference host2 - host1    : 0 messages, 0 bytes (0.000 KiB)
Detected 0 errors

This imapsync is up to date. ( local 1.882 >= official 1.882 )( Use --noreleasecheck to avoid this release check. )

Homepage: https://imapsync.lamiral.info/

# Entering tests_live_result()
Live tests ended successfully
# Leaving  tests_live_result()

Exiting with return value 0
Log file is LOG_imapsync/2019_01_03_15_29_27_448_test1_test2.txt ( to change it, use --logfile filepath ; or use --nolog to turn off logging )
`;

class Hero extends PureComponent {
  static propTypes = {
    command: PropTypes.string.isRequired,
    commandJson: PropTypes.arrayOf(PropTypes.shape({
      host_1: PropTypes.string.isRequired,
      user_1: PropTypes.string.isRequired,
      password_1: PropTypes.string.isRequired,
      host_2: PropTypes.string.isRequired,
      user_2: PropTypes.string.isRequired,
      password_2: PropTypes.string.isRequired,
    })).isRequired,
  }

  constructor(props) {
    super(props);

    this.execute = this.execute.bind(this);
    this.stdoutListener = this.stdoutListener.bind(this);
    this.stderrListener = this.stderrListener.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.outputLog = React.createRef();
  }

  componentDidMount() {
    ipcRenderer.on('command-stdout', this.stdoutListener);
    ipcRenderer.on('command-stderr', this.stderrListener);

    this.scrollToBottom();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-stdout', this.stdoutListener);
    ipcRenderer.removeListener('command-stderr', this.stderrListener);
  }

  stdoutListener(stdout) {
    console.log(stdout);
  }

  stderrListener(stderr) {
    console.log(stderr);
  }

  execute() {
    const { commandJson } = this.props;

    console.log('command', commandJson);

    ipcRenderer.send('command', commandJson);
  }

  scrollToBottom() {
    this.outputLog.current.scrollTop = this.outputLog.current.scrollHeight;
  }

  render() {
    const { command } = this.props;

    return (
      <Jumbotron>
        <Container>
          <h1>IMAP SYNC</h1>
          <FormGroup>
            <CopyGroup>
              <Input type="text" placeholder="Script will appear here" value={command} readOnly />
              <CopyToClipboard text={command}>
                <Button color="success">Copy</Button>
              </CopyToClipboard>
              <Button color="primary" onClick={this.execute}>Execute</Button>
            </CopyGroup>
          </FormGroup>
          <FormGroup>
            <OutputWindow defaultValue={text} ref={this.outputLog} />
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
