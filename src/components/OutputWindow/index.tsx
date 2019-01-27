import PerfectScrollbar from 'react-perfect-scrollbar';
import styled from 'styled-components';

interface OutputProps {
  outputBg?: string;
  outputColor?: string;
}

export default styled(PerfectScrollbar)`
  overflow: hidden;
  padding: 1rem;
  margin-bottom: 1rem;
  height: 300px;
  font-family: monospace;
  font-weight: 700;
  background: ${(props: OutputProps) => props.outputBg};
  color: ${(props: OutputProps) => props.outputColor};
  border-radius: .25rem;
`;