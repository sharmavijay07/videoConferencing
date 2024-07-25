import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/Peer";
import ReactPlayer from 'react-player'

const Roompage = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

  const [mystream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUser = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New user joined", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId)
    },
    [createOffer, socket]
  );

  const handleIncommingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log('Incomming Call from', from, offer)
    const ans = await createAnswer(offer)
    socket.emit('call-accepted', { emailId: from, ans })
    setRemoteEmailId(from)
  }, [createAnswer, socket]);

  const handleCallAccept = useCallback(async (data) => {
    const { ans } = data;
    console.log('Call got accepted', ans)
    await setRemoteAns(ans)
  }, [setRemoteAns]);

  const handleNegotiation = useCallback(async () => {
    const localOffer = peer.localDescription;
    socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer })
  }, [peer.localDiscription, remoteEmailId, socket])


  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });

    setMyStream(stream);
  }, [sendStream])

  useEffect(() => {
    socket.on("user-joined", handleNewUser);
    socket.on('incomming-call', handleIncommingCall);
    socket.on('call-accepted', handleCallAccept)

    return () => {
      socket.off('user-joined', handleNewUser);
      socket.off('incomming-call', handleIncommingCall);
      socket.off('call-accepted', handleCallAccept)
    }
  }, [socket]);


  useEffect(() => {
    peer.addEventListener('negotiationneeded', handleNegotiation)

    return () => {
      peer.removeEventListener('negotiationneeded', handleNegotiation)
    }
  }, [])

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream])

  return (
    <div className="room-page-container">
      <h1>Room Page</h1>
      <h2>You're connected to {remoteEmailId}</h2>
      <button onClick={e => sendStream(mystream)}>Send my Stream</button>
      <ReactPlayer url={mystream} playing />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default Roompage;
