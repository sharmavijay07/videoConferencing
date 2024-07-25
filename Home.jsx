import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/socket";

const Homepage = () => {
  const { socket } = useSocket();
  const navigate = useNavigate(socket);

  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();

  const handleJoinedRoom = useCallback(({ roomId }) => {
    navigate(`/room/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    socket.on("joined-room", handleJoinedRoom);

    return () => {
      socket.off("joined-room", handleJoinedRoom);
    }
  }, [handleJoinedRoom, socket]);

  const handleJoinRoom = () => {
    socket.emit("join-room", { emailId: email, roomId });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter  email"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter RoomId"
        />
        <button onClick={handleJoinRoom}>Enter Room</button>
      </div>
    </div>
  );
};

export default Homepage;
