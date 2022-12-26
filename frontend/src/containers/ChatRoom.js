import styled from "styled-components";
import Title from "../components/title";
import Message from "../components/Message";
import ChatModal from "../components/ChatModel";
import { useChat } from "./hooks/useChat";

import { Input, Tabs } from "antd";
import { useState, useEffect, useRef } from "react";

const ChatBoxesWrapper = styled(Tabs)`
	width: 150%;
	height: 400px;
	background: #eeeeee52;
	border-radius: 10px;
	margin: 20px;
	padding: 20px;
`;

const MessageWrapper = styled.div`
	width: 100%;
	height: 300px;
	background: #eeeeee52;
	overflow: auto;
`;

const FootRef = styled.div`
	height: 20px;
`;

function ChatRoom() {
	const [body, setBody] = useState("");
	const [msgSent, setMsgSent] = useState(false);
	const [chatBoxes, setChatBoxes] = useState([]);
	const [activeKey, setActiveKey] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const bodyRef = useRef(null);
	const msgFooter = useRef(null);

	const {
		me,
		status,
		displayStatus,
		messages,
		friend,
		setFriend,
		sendMessage,
		startChat,
		getChatBox,
	} = useChat();

	const scrollToBottom = () => {
		msgFooter.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	useEffect(() => {
		scrollToBottom();
		setMsgSent(false);
	}, [msgSent]);

	useEffect(() => {
		//console.log(messages);
		let block = <>{renderChat(messages)}</>;
		let newbox = chatBoxes.map((e) => {
			return e.label === activeKey
				? { label: e.label, children: block, key: e.label }
				: { label: e.label, children: null, key: e.label };
		});
		setChatBoxes(newbox);
		setMsgSent(true);
	}, [messages]);

	useEffect(() => {
		displayStatus(status);
	}, [status]);

	useEffect(() => {
		console.log("changefriend")
		startChat({
			variables: {name1:me, name2:friend},
		});
	},[friend])

	const renderChat = (chat) => {
		console.log(chat);
		let r = (
			<MessageWrapper>
				{chat.length === 0 ? (
					<p style={{ color: "#ccc" }}> No messages... </p>
				) : (
					chat.map(({ sender, body }, i) => {
						return (
							<Message
								name={sender}
								message={body}
								isMe={sender === me}
							/>
						);
					})
				)}
				<FootRef ref={msgFooter} />
			</MessageWrapper>
		);

		return r;
	}; // 產⽣ chat 的 DOM nodes

	const createChatBox = (friend) => {
		if (chatBoxes.some(({ key }) => key === friend)) {
			displayStatus({
				type: "error",
				msg: friend + "'s chatbox has been opened",
			});
			throw new Error("chatbox has been opened");
		}

		setChatBoxes([
			...chatBoxes,
			{ label: friend, children: [], key: friend },
		]);
		//console.log(chatBoxes);
		return friend;
	};

	const removeChatBox = (targetKey, activeKey) => {
		const index = chatBoxes.findIndex(({ key }) => key === activeKey);
		const newChatBoxes = chatBoxes.filter(({ key }) => key !== targetKey);

		setChatBoxes(newChatBoxes);

		let newFriend = activeKey
			? activeKey === targetKey
				? index === 0
					? chatBoxes.length > 1
						? chatBoxes[index + 1].key
						: ""
					: chatBoxes[index - 1].key
				: activeKey
			: "";
		setFriend(newFriend)
		return newFriend
	};
	//console.log(chatBoxes);
	//const cd = chatBoxes.find((e) => e.label === activeKey);
	//console.log(cd);

	return (
		<>
			<Title name={me} />

			<ChatBoxesWrapper
				type="editable-card"
				onChange={(key) => {
					setActiveKey(key);
					setFriend(key);
				}}
				onEdit={(targetKey, action) => {
					if (action === "add") setModalOpen(true);
					else if (action === "remove") {
						setActiveKey(removeChatBox(targetKey, activeKey));
					}
				}}
				items={chatBoxes}
				activeKey={activeKey}
			></ChatBoxesWrapper>

			<ChatModal
				open={modalOpen}
				onCreate={({ name }) => {
					setFriend(name);
					setActiveKey(createChatBox(name));
					setModalOpen(false);
				}}
				onCancel={() => {
					setModalOpen(false);
				}}
			/>

			<Input.Search
				enterButton="Send"
				placeholder="Type a message here..."
				value={body}
				ref={bodyRef}
				onChange={(e) => setBody(e.target.value)}
				onSearch={(msg) => {
					if (!msg) {
						displayStatus({
							type: "error",
							msg: "Please enter a message body.",
						});
						return;
					}
					if (activeKey === "") {
						displayStatus({
							type: "error",
							msg: "So sad you have no friend...",
						});
						return;
					}
					sendMessage({
						variables: { name:me, to:activeKey, body:msg},
					});
					setMsgSent(true);
					setBody("");
				}}
			></Input.Search>
			{/* {activeKey ? <h2>use "//" to clear this chatroom</h2> : null} */}
		</>
	);
}

export default ChatRoom;
