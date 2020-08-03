import { createComponent } from 'cf-style-container';
import { difficultyMap } from '../utils/minesweeper';

const StyledDiv = createComponent(() => ({}), 'div');
const Select = createComponent(() => ({}), 'select', ['value', 'onChange']);
const H3 = createComponent(
  () => ({
    margin: 0
  }),
  'h3'
);
const Input = createComponent(() => ({}), 'input', ['value', 'onChange']);
const CheckBox = createComponent(() => ({}), 'input', [
  'type',
  'value',
  'onChange'
]);
const Button = createComponent(() => ({}), 'button', ['onClick']);
const ControlDiv = createComponent(
  () => ({
    height: '4rem'
  }),
  'div'
);

const validBoardSizeInput = inputSize => {
  return !isNaN(parseInt(inputSize));
};

const controlsInitialState = {
  boardSize: '',
  difficulty: difficultyMap.easy.text,
  authenticMode: false,
  revealAllMode: false
};

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = controlsInitialState;
  }

  formSubmit() {
    const gameBoardSettings = {
      ...this.state,
      probability: difficultyMap[this.state.difficulty].probability
    };

    if (this.state.boardSize === '') {
      this.props.submitForm({
        ...gameBoardSettings
      });
    }

    if (validBoardSizeInput(this.state.boardSize)) {
      this.props.submitForm({
        ...gameBoardSettings,
        boardSize: parseInt(this.state.boardSize)
      });
    }
  }

  render() {
    return (
      <StyledDiv>
        <ControlDiv>
          <H3>Board Size</H3>
          <Input
            value={this.state.boardSize}
            onChange={event => this.setState({ boardSize: event.target.value })}
          />
        </ControlDiv>
        <ControlDiv>
          <H3>Difficulty</H3>
          <Select
            value={this.state.difficulty}
            onChange={event =>
              this.setState({ difficulty: event.target.value })
            }
          >
            {Object.keys(difficultyMap).map(option => {
              return <option key={option}>{difficultyMap[option].text}</option>;
            })}
          </Select>
        </ControlDiv>
        <ControlDiv>
          <H3>Authentic Mode</H3>
          <CheckBox
            type="checkbox"
            value={this.state.authenticMode}
            onChange={() =>
              this.setState({ authenticMode: !this.state.authenticMode })
            }
          />
        </ControlDiv>
        <ControlDiv>
          <H3>Reveal All Mode</H3>
          <CheckBox
            type="checkbox"
            value={this.state.revealAllMode}
            onChange={() =>
              this.setState({ revealAllMode: !this.state.revealAllMode })
            }
          />
        </ControlDiv>
        <Button onClick={() => this.formSubmit()}>Update Game Settings</Button>
      </StyledDiv>
    );
  }
}

export default Controls;
