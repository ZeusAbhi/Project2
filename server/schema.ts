import * as mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  messages: {
    type: [
      {
        type: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
    required: true,
  },
});
const messagesModel = mongoose.model("rooms", messageSchema);
export default messagesModel;
