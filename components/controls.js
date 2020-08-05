import { createComponent } from 'cf-style-container';
import { difficultyMap } from '../utils/minesweeper';

const sharedStyles = {
  margin: 0,
  padding: 0,
  paddingRight: '0.25rem'
};

const StyledDiv = createComponent(
  () => ({
    display: 'flex',
    flexDirection: 'column'
  }),
  'div'
);
const Select = createComponent(() => ({}), 'select', ['value', 'onChange']);
const P = createComponent(
  () => ({
    ...sharedStyles
  }),
  'p'
);
const H3 = createComponent(
  () => ({
    ...sharedStyles
  }),
  'h3'
);
const Input = createComponent(() => ({}), 'input', [
  'value',
  'type',
  'onChange'
]);
const CheckBox = createComponent(
  () => ({
    marginTop: '6px'
  }),
  'input',
  ['type', 'value', 'onChange']
);
const Button = createComponent(() => ({}), 'button', ['onClick']);
const ControlDiv = createComponent(() => ({}), 'div');

const CheckBoxDiv = createComponent(
  () => ({
    display: 'flex',
    alignItems: 'center'
  }),
  'div'
);

const validBoardSizeInput = inputSize => {
  return !isNaN(parseInt(inputSize));
};

const controlsInitialState = {
  difficulty: difficultyMap.easy.text,
  authenticMode: false,
  revealAllMode: false
};

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...controlsInitialState, boardSize: props.boardSize };
  }

  render() {
    return (
      <React.Fragment>
        <StyledDiv>
          <ControlDiv>
            <H3>Board Size</H3>
            <Input
              value={this.state.boardSize}
              type="number"
              onChange={event => {
                this.setState({ boardSize: event.target.value });
                this.props.updateGameSettings({
                  boardSize: parseInt(event.target.value)
                });
              }}
            />
          </ControlDiv>
          <ControlDiv>
            <H3>Difficulty</H3>
            <Select
              value={this.state.difficulty}
              onChange={event => {
                this.setState({ difficulty: event.target.value });
                this.props.updateGameSettings({
                  probability: difficultyMap[this.state.difficulty].probability
                });
              }}
            >
              {Object.keys(difficultyMap).map(option => {
                return (
                  <option key={option}>{difficultyMap[option].text}</option>
                );
              })}
            </Select>
          </ControlDiv>
          <ControlDiv>
            <CheckBoxDiv>
              <H3>Reveal All Mode</H3>
              <CheckBox
                type="checkbox"
                value={this.state.revealAllMode}
                onChange={() => {
                  this.setState({ revealAllMode: !this.state.revealAllMode });
                  this.props.updateGameSettings({
                    revealAllMode: !this.state.revealAllMode
                  });
                }}
              />
            </CheckBoxDiv>
            <P>Reveals the entire minesweeper board.</P>
          </ControlDiv>
        </StyledDiv>
      </React.Fragment>
    );
  }
}

export default Controls;
