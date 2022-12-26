import { useState, createContext, useContext, useEffect } from "react";
import { message } from "antd";

import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { CHATBOX_QUERY, CREATE_CHATBOX_MUTATION, CREATE_MESSAGE_MUTATION, MESSAGE_SUBSCRIPTION } from "../../graphql"

var unSub = []
//const client = new WebSocket("ws://localhost:4000"); //step 2

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const displayStatus = (s) => {
	if (s.msg) {
		const { type, msg } = s;
		const content = {
			content: msg,
			duration: 1.5,
		};
		switch (type) {
			case "success":
				message.success(content);
				break;
			case "error":
			default:
				message.error(content);
				break;
		}
	}
};

const ChatContext = createContext({
	status: {},
	me: "",
	friend: "",
	signedIn: false,
	messages: [],
	startChat:() => {},
	sendMessage: () => {},
	clearMessages: () => {},
	getChatBox:() => {}, 
});

const ChatProvider = (props) => {
	const [status, setStatus] = useState({});
	const [me, setMe] = useState(savedMe || "");
	const [signedIn, setSignedIn] = useState(false);
	const [messages, setMessages] = useState([]);
	const [friend, setFriend] = useState("");

	const [getChatBox, { data, loading, refetch, subscribeToMore}] = useLazyQuery(CHATBOX_QUERY, {
		variables: {
		name: [me,friend].sort().join("_")
 	},
	});

	const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
	const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION);

	useEffect(() => {
		if (signedIn) {
			localStorage.setItem(LOCALSTORAGE_KEY, me);
		}
	}, [me, signedIn]);

	useEffect(() => {		
		if(!data) return;
		console.log(data)
		setMessages(data.chatbox.messages)
	}, [data]);

	useEffect(() => {
		//refetch({name: [me,friend].sort().join("_")})
		// getChatBox({variables:{
		// 	name: [me,friend].sort().join("_")
		// }})
	},[friend])

	useEffect(() => {
		//console.log("ss")
		// getChatBox();
		if(unSub.length != 0){
			unSub[0]();
			unSub.pop();
		}

		try {
			//console.log("sm")
			const f = subscribeToMore({
				document: MESSAGE_SUBSCRIPTION,
				variables: { from: me, to: friend },
				updateQuery: (prev, { subscriptionData }) => {
					if (!subscriptionData.data) return prev;
					//console.log(subscriptionData);
					const newMessage = subscriptionData.data.message;
					//console.log(newMessage)
					return {
					chatbox: {
						name:prev.chatbox.name,
						messages: [...prev.chatbox.messages, newMessage],},
					};
				},
			});
			unSub.push(f);
			refetch({name: [me,friend].sort().join("_")})

		} catch (e) {}
	}, [friend]);



	return (
		<ChatContext.Provider
			value={{
				status,
				me,
				friend,
				signedIn,
				messages,
				setMe,
				setFriend,
				setSignedIn,
				sendMessage,
				displayStatus,
				startChat,
				getChatBox,
			}}
			{...props}
		/>
	);
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
