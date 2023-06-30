import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // 서버의 URL에 맞게 변경

//Chat 컴포넌트를 정의한다. 
function Chat() {
// username, messages, inputValue 세 개의 상태 변수와 각각의 초기값 정의.
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  //useEffect 훅을 사용하여 컴포넌트가 마운트되었을 때 Socket.IO 이벤트 리스너를 등록하고,
  //컴포넌트가 언마운트될 때 이벤트 리스너를 해제
  useEffect(() => {
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  //handleMessage 함수는 새로운 메세지를 받았을 때 message 상태를 업데이트함. 
  
  const handleMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleMessageSend = () => {
    if (inputValue.trim() !== "") {
      const currentTime = new Date().toLocaleTimeString();
      socket.emit("message", {
        username,
        content: inputValue,
        time: currentTime,
      });
      setInputValue("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="사용자 이름"
      />

      <h2>채팅</h2>
      <div>
        {messages.map((message, index) => (
          <p key={index} style={{ color: message.color }}>
            {message.username}: {message.content} - {message.time}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleMessageSend}>전송</button>
    </div>
  );
}

export default Chat;