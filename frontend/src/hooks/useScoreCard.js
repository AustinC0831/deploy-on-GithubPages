import { createContext, useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ADD_MESSAGE_COLOR = '#3d84b8';
const REGULAR_MESSAGE_COLOR = '#2b2e4a';
const ERROR_MESSAGE_COLOR = '#fb3640';

const ScoreCardContext = createContext({
  messages: [],
  qmessages: [],

  addCardMessage: () => {},
  addAfterMessage: () => {},
  addRegularMessage: () => {},
  addErrorMessage: () => {},
  clearMessage: () => {}
});

var count1 = 0;
var count2 = 0

const makeMessage = (message, color) => {
  count1++;

  let messagecontent = 
    <Typography variant="body2" key={count1} style={{ color:color }}>
      {message}
    </Typography>

  return messagecontent;
};

const makeTable = (...ms) => {
  count2++;
  let messagecontent =
  <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="right">Subject</TableCell>
        <TableCell align="right">Score</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {ms.map((e) => {
        return <TableRow key={e.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row">{e.name}</TableCell>
        <TableCell align="right">{e.subject}</TableCell>
        <TableCell align="right">{e.score}</TableCell>
      </TableRow>
      } 
      )}
    </TableBody>
  </Table>
</TableContainer>

return messagecontent;
}

const ScoreCardProvider = (props) => {
  const [messages, setMessages] = useState([]);
  const [qmessages, setqMessages] = useState([]);

  const addCardMessage = (message,...afterMessage) => {
    setMessages([...messages, makeMessage(message, ADD_MESSAGE_COLOR), makeTable(...afterMessage)]);
  };

  const addAfterMessage = (...ms) => {
    setMessages([...messages,makeTable(...ms)]);
  };

  const addRegularMessage = (...ms) => {
    setqMessages([...qmessages,makeTable(...ms)]);
  };

  const addErrorMessage = (errorMessage) => {
    setqMessages([...qmessages, makeMessage(errorMessage, ERROR_MESSAGE_COLOR)]);
  };

  const clearMessage = (ms) => {
    setMessages([makeMessage(ms, REGULAR_MESSAGE_COLOR)]);
    setqMessages([makeMessage(ms, REGULAR_MESSAGE_COLOR)]);
  };

  return (
    <ScoreCardContext.Provider
      value={{
        messages,
        qmessages,
        addCardMessage,
        addAfterMessage,
        addRegularMessage,
        addErrorMessage,
        clearMessage
      }}
      {...props}
    />
  );
};

function useScoreCard() {
  return useContext(ScoreCardContext);
}

export { ScoreCardProvider, useScoreCard };
