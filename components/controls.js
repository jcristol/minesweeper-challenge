import { createComponent } from 'cf-style-container';

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

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: '',
      difficulty: 'easy',
      authenticMode: false
    };
  }

  formSubmit() {
    if (validBoardSizeInput(this.state.boardSize)) {
      const { difficulty, authenticMode, boardSize } = this.state;
      const formSubmission = {
        boardSize: parseInt(boardSize),
        difficulty,
        authenticMode
      };
      const { submitForm } = this.props;
      submitForm(formSubmission);
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
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
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
        <Button onClick={() => this.formSubmit()}>Update Game Settings</Button>
      </StyledDiv>
    );
  }
}

export default Controls;
