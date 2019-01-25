import { FormGroup, Label } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styled from 'styled-components';

interface OutputProps {
  outputBg?: string;
  outputColor?: string;
}

export const OutputWindow = styled(PerfectScrollbar)`
  overflow: hidden;
  padding: 1rem;
  margin-bottom: 1rem;
  height: 300px;
  font-family: monospace;
  font-weight: 700;
  background: ${(props: OutputProps) => props.outputBg};
  color: ${(props: OutputProps) => props.outputColor};
`;

export const StyledFormGroup = styled(FormGroup)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const StyledLabel = styled(Label)`
  margin: 1rem 0 .25rem;
  display: block;
`;
