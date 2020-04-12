import * as React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'
import { connect } from 'react-redux'

declare global {
  interface Window {
    require: any;
  }
}

const { ipcRenderer } = window.require('electron')

interface Props {
  background?: string;
  color?: string;
  content?: string;
}

interface Settings {
  outputBackground: string;
  outputColor: string;
}

interface RState {
  settings: Settings;
}

interface State {
  output: string;
}

const mapStateToProps = (state: RState) => ({
  background: state.settings.outputBackground,
  color: state.settings.outputColor,
})

const Window = styled(PerfectScrollbar)`
  padding: 1rem;
  margin-bottom: 1rem;
  height: 300px;
  font-family: monospace;
  font-weight: 700;
  border-radius: 0.25rem;
`

class OutputWindow extends React.Component<Props, State> {
  private outputLog: any;

  constructor(props: Props) {
    super(props)

    this.stdoutListener = this.stdoutListener.bind(this)
    this.stderrListener = this.stderrListener.bind(this)
    this.outputScrollBottom = this.outputScrollBottom.bind(this)

    this.outputLog = React.createRef<any>()

    this.state = {
      output: '',
    }
  }

  componentDidMount() {
    ipcRenderer.on('command-stdout', this.stdoutListener)
    ipcRenderer.on('command-stderr', this.stderrListener)

    this.outputScrollBottom()
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-stdout', this.stdoutListener)
    ipcRenderer.removeListener('command-stderr', this.stderrListener)
  }

  stdoutListener(event: any, stdout: string) {
    this.setState((prevState) => {
      const shortened = prevState.output
        .split(/\r\n|\r|\n/)
        .splice(prevState.output.split(/\r\n|\r|\n/).length - 40)
        .join('\n')

      return {
        output: shortened + stdout,
      }
    })

    this.outputScrollBottom()
  }

  stderrListener() {
    this.outputScrollBottom()
  }

  outputScrollBottom() {
    this.outputLog.scrollTop = this.outputLog.scrollHeight
  }

  render() {
    const { output } = this.state
    const { background, color } = this.props

    return (
      <Window
        containerRef={(ref) => {
          this.outputLog = ref
        }}
        className="shadow-lg overflow-hidden"
        style={{
          background,
          color,
        }}
      >
        <pre
          className="overflow-hidden"
          style={{
            color,
          }}
        >
          {output}
        </pre>
      </Window>
    )
  }
}

export default connect(mapStateToProps)(OutputWindow)
