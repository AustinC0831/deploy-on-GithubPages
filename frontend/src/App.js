import styled from "styled-components";
import { useChat } from "./containers/hooks/useChat";

import SignIn from "./containers/SignIn";
import ChatRoom from "./containers/ChatRoom";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 500px;
	margin: auto;
`;

function App() {
	const { signedIn } = useChat(); //用一樣名子assign

	return <Wrapper> {signedIn ? <ChatRoom /> : <SignIn />} </Wrapper>;
}

export default App;
