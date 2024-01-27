# ChatMongus

ChatMongus is a real-time chat application inspired by the popular game Among Us. It is built using MongoDB, SocketIO, ViteJS, and NodeJS. The application allows users to engage in live chat sessions, supporting various features to enhance the user experience.

## Features

- **MongoDB Integration**: ChatMongus utilizes MongoDB to store chat messages. This ensures that users can view previous messages even after logging out and re-entering a chat room.

- **Real-time Communication with SocketIO**: The application leverages SocketIO for real-time communication, enabling seamless and instantaneous message exchange between users.

- **Multiple Rooms Support**: ChatMongus supports the creation of multiple chat rooms, allowing users to engage in different conversations simultaneously.

- **Media Support**:
  - **Multiple Images using Cloudinary**: Users can share multiple images within the chat rooms, with seamless integration with Cloudinary for efficient storage and retrieval.
  - **Videos Support**: ChatMongus enables users to share videos, enhancing the range of multimedia interactions within the application.

- **Emoji Support for Laptops and Desktops**: The application includes emoji support for laptops and desktops, adding a fun and expressive element to the chat experience.

## Getting Started

To run ChatMongus locally, follow these steps:

1. **Clone the repository:**

   ```bash
   https://github.com/ZeusAbhi/Project2.git
2. **Install dependencies**

    ```bash
      cd client
      npm install
3. **Set up MongoDB**:

 Ensure you have MongoDB installed and running.
 Configure the MongoDB connection in the application.
 
4. **Configure Cloudinary***:

Create a Cloudinary account if you don't have one.
Set up the Cloudinary configuration in the application for image and video support.

5. **Start DEV Server**
  ```bash
   cd client
   npm run dev
