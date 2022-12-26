import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  & button {
    margin-left: 1em;
  }
`;

const Header = () => {
  const { addRegularMessage, clearMessage } = useScoreCard();

  const handleClearDB = async () => {
    const {
      data: { message },
    } = await axios.delete('/cards');
    clearMessage(message);
    //addRegularMessage(message);
  };

  const handleClearcs = async () => {
    let message = 'Console clear'
    clearMessage(message);
  };


  return (
    <Wrapper>
      <Typography variant="h2">ScoreCard DB</Typography>
      <Button variant="contained" color="secondary" onClick={handleClearDB}>
        Clear DB
      </Button>
      <Button variant="contained" color="secondary" onClick={handleClearcs}>
        Clear console
      </Button>
    </Wrapper>
  );
};

export default Header;
