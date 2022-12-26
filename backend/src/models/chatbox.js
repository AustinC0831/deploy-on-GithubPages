import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatBoxSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required.']
	},
	messages: [{
		sender: { type: String },
		body : { type: String }, 
	}],
   });

const ChatBoxModel = mongoose.model('ChatBox', ChatBoxSchema);

export default ChatBoxModel;
