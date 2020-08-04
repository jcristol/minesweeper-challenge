import { createComponent } from 'cf-style-container';
import { difficultyMap } from '../utils/minesweeper';

const sharedStyles = {
  margin: 0,
  padding: 0,
  paddingRight: '0.25rem'
};

const StyledDiv = createComponent(
  () => ({
    display: 'grid',
    gridTemplateRows: 'auto auto auto',
    gridTemplateColumns: '20rem auto',
    gridRowGap: '2rem',
    gridColumnGap: '1rem'
  }),
  'div'
);
const Select = createComponent(() => ({}), 'select', ['value', 'onChange']);
const P = createComponent(
  () => ({
    ...sharedStyles,
    paddingTop: '0.5rem'
  }),
  'p'
);
const H3 = createComponent(
  () => ({
    ...sharedStyles
  }),
  'h3'
);
const Input = createComponent(() => ({}), 'input', ['value', 'onChange']);
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
      <React.Fragment>
        <StyledDiv>
          <ControlDiv>
            <H3>Board Size</H3>
            <Input
              value={this.state.boardSize}
              onChange={event =>
                this.setState({ boardSize: event.target.value })
              }
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
                return (
                  <option key={option}>{difficultyMap[option].text}</option>
                );
              })}
            </Select>
          </ControlDiv>
          <ControlDiv>
            <CheckBoxDiv>
              <H3>Authentic Mode</H3>
              <CheckBox
                type="checkbox"
                value={this.state.authenticMode}
                onChange={() =>
                  this.setState({ authenticMode: !this.state.authenticMode })
                }
              />
            </CheckBoxDiv>
            <P>
              When Checked mimics actual minesweeper behavior where clicking on
              a tile in the open reveals more then a single tile.
            </P>
          </ControlDiv>
          <ControlDiv>
            <CheckBoxDiv>
              <H3>Reveal All Mode</H3>
              <CheckBox
                type="checkbox"
                value={this.state.revealAllMode}
                onChange={() =>
                  this.setState({ revealAllMode: !this.state.revealAllMode })
                }
              />
            </CheckBoxDiv>
            <P>Reveals the entire minesweeper board.</P>
          </ControlDiv>
        </StyledDiv>
        <Button onClick={() => this.formSubmit()}>Update Game Settings</Button>
      </React.Fragment>
    );
  }
}

export default Controls;
