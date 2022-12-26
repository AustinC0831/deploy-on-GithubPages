import { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useStyles } from '../hooks';
import { api } from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;

const Body = () => {
  const classes = useStyles();

  const { messages, qmessages, addCardMessage, addAfterMessage, addRegularMessage, addErrorMessage } =
    useScoreCard();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);

  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleAdd = async () => {
    const {
      data: { message, card, afterMessage },
    } = await api.post('/card', {
      name,
      subject,
      score,
    });

    if (!card) addErrorMessage(message);
    else {
      addCardMessage(message,...afterMessage);
    }

    setName('');
    setSubject('');
    setScore(60);
  };

  const handleQuery = async () => {
    const {
      data: { messages, message },
    } = await axios.get('/cards', {
      params: {
        type: queryType,
        queryString,
      },
    });

    if (!messages) addErrorMessage(message);
    else addRegularMessage(...messages);

    setQueryString('');
  };

  const addTab = 
  <Wrapper>
    <Row>
    {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
    <TextField
      className={classes.input}
      placeholder="Name"
      value={name}
      onChange={handleChange(setName)}
    />
    <TextField
      className={classes.input}
      placeholder="Subject"
      style={{ width: 240 }}
      value={subject}
      onChange={handleChange(setSubject)}
    />
    <TextField
      className={classes.input}
      placeholder="Score"
      value={score}
      onChange={handleChange(setScore)}
      type="number"
    />
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      disabled={!name || !subject}
      onClick={handleAdd}
    >
      Add
    </Button>
    </Row>
    <ContentPaper variant="outlined">
        {messages.map((m) => {
            return m;
        })}
    </ContentPaper>
  </Wrapper>

  const queryTab =
  <Wrapper>
  <Row>
    <StyledFormControl>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={queryType}
          onChange={handleChange(setQueryType)}
        >
        <FormControlLabel
          value="name"
          control={<Radio color="primary" />}
          label="Name"
        />
        <FormControlLabel
          value="subject"
          control={<Radio color="primary" />}
          label="Subject"
        />
        </RadioGroup>
      </FormControl>
    </StyledFormControl>
    <TextField
      placeholder="Query string..."
      value={queryString}
      onChange={handleChange(setQueryString)}
      style={{ flex: 1 }}
    />
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      disabled={!queryString}
      onClick={handleQuery}
    >Query
    </Button>
  </Row>
  <ContentPaper variant="outlined">
        {qmessages.map((m) => {
          return m;
        })}
  </ContentPaper>
</Wrapper>

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Add" />
        <Tab label="Query" />
      </Tabs>
      {tabValue===0?addTab:queryTab}
    </Box>
  );
};

export default Body;
