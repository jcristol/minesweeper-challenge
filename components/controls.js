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
    flexDirection: 'column',
    marginBottom: '1rem'
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

const ControlDiv = createComponent(
  () => ({
    marginBottom: '0.5rem'
  }),
  'div'
);

const CheckBoxDiv = createComponent(
  () => ({
    display: 'flex',
    alignItems: 'center'
  }),
  'div'
);

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.initialGameSettings;
  }

  render() {
    const { updateGameSettings } = this.props;
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
                updateGameSettings({ boardSize: parseInt(event.target.value) });
              }}
            />
          </ControlDiv>
          <ControlDiv>
            <H3>Difficulty</H3>
            <Select
              value={this.state.difficulty}
              onChange={event => {
                this.setState({ difficulty: event.target.value });
                updateGameSettings({ difficulty: event.target.value });
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
                  const modeToggled = !this.state.revealAllMode;
                  this.setState({ revealAllMode: modeToggled });
                  updateGameSettings({ revealAllMode: modeToggled });
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
