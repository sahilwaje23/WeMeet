// console.log("ROOM MODULE LOADED");
import { useEffect, useRef, useState } from "react";
import {
  Hexagon,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  Video,
  Monitor,
  Link2,
  Menu,
} from "lucide-react";
import { BACKEND_URL } from "../config";

// moduel imports
// import { useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import socket from "../socket/socket";
import { VideoOff } from "lucide-react";

// component imports

import Sidebar from "../components/Sidebar";
import Control from "../components/Control";
import VideoGrid from "../components/VideoGrid";
import FloatingTools from "../components/FloatingTools";
import Whiteboard from "../components/Whiteboard";
import CodeEditor from "../components/CodeEditor";

export default function Room() {
  const { roomId } = useParams();

  const remoteVideoRef = useRef(null);

  const [participants, setParticipants] = useState([]);

  const [remoteMuted, setRemoteMuted] = useState(false);

  const [seconds, setSeconds] = useState(0);

  // const secondsRef = useRef(0);
  const [startTime, setStartTime] = useState(null);

  const [copied, setCopied] = useState(false);

  // for chat
  // const [showChat, setShowChat] = useState(false);
  // const [showPeople, setShowPeople] = useState(false);

  // sidebar stuff
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const location = useLocation();

  const username = location.state?.username;

  // const [isMuted, setIsMuted] = useState(false);
  // const [cameraOff, setCameraOff] = useState(false);

  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("micMuted") === "true",
  );

  const [cameraOff, setCameraOff] = useState(
    localStorage.getItem("cameraOff") === "true",
  );

  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const [mySocketId, setMySocketId] = useState(""); // obviously for storing my socket id

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const videoRef = useRef(null);

  const localStream = useRef(null);

  const peerConnection = useRef(null);

  // white board states

  const [whiteboardOpen, setWhiteboardOpen] = useState(false);

  // const [selectedFile, setSelectedFile] = useState(null);

  // const mySocketId = socket.id;

  // const remoteParticipant = participants.find((p) => p.id !== mySocketId);

  const remoteParticipant = participants.find((p) => p.id !== socket.id);

  //FOR CODE EDITOR

  const [showCodeEditor, setShowCodeEditor] = useState(false);

  // const toggleMute = () => {
  //   const audioTrack = localStream.current?.getAudioTracks()[0];

  //   if (!audioTrack) return;

  //   audioTrack.enabled = !audioTrack.enabled;

  //   const muted = !audioTrack.enabled;

  //   setIsMuted(muted);

  //   socket.emit("mic-status", {
  //     roomId,
  //     muted,
  //   });

  //   console.log("Mic:", muted ? "OFF" : "ON");
  // };

  const copyMeetingLink = async () => {
    try {
      const link = `${window.location.origin}/room/${roomId}/lobby`;

      await navigator.clipboard.writeText(link);

      // alert("Meeting link copied!");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMute = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    const muted = !audioTrack.enabled;

    setIsMuted(muted);

    localStorage.setItem("micMuted", muted);

    socket.emit("mic-status", {
      roomId,
      muted,
    });

    console.log("Mic:", muted ? "OFF" : "ON");

    socket.emit("mic-status", {
      roomId,
      muted,
    });
  };
  // const toggleCamera = () => {
  //   const videoTrack = localStream.current?.getVideoTracks()[0];

  //   if (!videoTrack) return;

  //   videoTrack.enabled = !videoTrack.enabled;

  //   setCameraOff(!videoTrack.enabled);

  //   console.log("Camera:", videoTrack.enabled ? "ON" : "OFF");
  // };
  const toggleCamera = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    const cameraDisabled = !videoTrack.enabled;

    setCameraOff(cameraDisabled);

    localStorage.setItem("cameraOff", cameraDisabled);

    console.log("Camera:", videoTrack.enabled ? "ON" : "OFF");
  };
  const shareScreen = async () => {
    try {
      if (isSharingScreen) {
        const cameraTrack = localStream.current.getVideoTracks()[0];

        const sender = peerConnection.current
          .getSenders()
          .find((s) => s.track?.kind === "video");

        await sender.replaceTrack(cameraTrack);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream.current;
        }

        setIsSharingScreen(false);

        return;
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      await sender.replaceTrack(screenTrack);

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }

      console.log("Screen sharing started");

      setIsSharingScreen(true);
      screenTrack.onended = async () => {
        const cameraTrack = localStream.current.getVideoTracks()[0];

        await sender.replaceTrack(cameraTrack);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream.current;
        }

        console.log("Screen sharing stopped");
        setIsSharingScreen(false);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const leaveCall = () => {
    socket.disconnect();

    peerConnection.current?.close();

    navigate("/");
  };

  //chat function

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    socket.emit("send-message", {
      roomId,
      sender: localStorage.getItem("username"),
      message: messageInput,
    });

    setMessageInput("");
  };

  const handleMessage = (messageData) => {
    console.log("Message received:", messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // const uploadFile = async () => {
  //   if (!selectedFile) return;

  //   const formData = new FormData();

  //   formData.append("file", selectedFile);

  //   const response = await fetch("http://localhost:8000/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   const data = await response.json();

  //   console.log(data);
  // };

  // const uploadFile = async () => {
  //   console.log("UPLOAD CLICKED");

  //   if (!selectedFile) {
  //     console.log("NO FILE SELECTED");
  //     return;
  //   }

  //   console.log("FILE:", selectedFile);

  //   const formData = new FormData();

  //   formData.append("file", selectedFile);

  //   try {
  //     const response = await fetch(`${BACKEND_URL}/api/upload`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     console.log("RESPONSE:", response);

  //     const data = await response.json();

  //     socket.emit("send-file", {
  //       roomId,
  //       sender: localStorage.getItem("username"),
  //       fileName: data.fileName,
  //       fileUrl: data.fileUrl,
  //     });

  //     setSelectedFile(null);

  //     console.log("DATA:", data);
  //   } catch (err) {
  //     console.log("ERROR:", err);
  //   }
  // };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      socket.emit("send-file", {
        roomId,
        sender: localStorage.getItem("username"),
        fileName: data.fileName,
        fileUrl: data.fileUrl,
      });

      setSelectedFile(null);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection State:", peerConnection.current.connectionState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log("ICE State:", peerConnection.current.iceConnectionState);
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStream.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // added for keeping the video and connections correct means when the window is refreshed the react state changes , the connection breaks webRTC changes , so we need to store the previous state

        // const micMuted = localStorage.getItem("micMuted") === "true";

        // const cameraOffStored = localStorage.getItem("cameraOff") === "true";

        // stream.getAudioTracks()[0].enabled = !micMuted;

        // stream.getVideoTracks()[0].enabled = !cameraOffStored;

        const micMuted = localStorage.getItem("micMuted") === "true";

        const cameraOffStored = localStorage.getItem("cameraOff") === "true";

        stream.getAudioTracks()[0].enabled = !micMuted;

        stream.getVideoTracks()[0].enabled = !cameraOffStored;

        setIsMuted(micMuted);

        
        setCameraOff(cameraOffStored);
        
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });
        
        console.log("Tracks added successfully");
        console.log("Local tracks:", stream.getTracks());
        
        peerConnection.current.ontrack = (event) => {
          console.log("REMOTE TRACK RECEIVED");
          console.log(event);
          console.log(event.streams);
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              roomId,
              candidate: event.candidate,
            });
          }
        };
        
        // JOIN ONLY AFTER TRACKS EXIST
        // socket.emit("join-room", roomId);
        
        console.log("isMuted value: ",isMuted);
        console.log("localstorage muted value: ", localStorage.getItem("micMuted"));
        
        socket.emit("join-room", {
          roomId,
          name: sessionStorage.getItem("username"),
          muted: localStorage.getItem("micMuted")==="true" ,
        });
        // console.log("session storage muted value: ", sessionStorage.getItem("username"));
        // socket.emit("mic-status", {
        //   roomId,
        //   muted: micMuted,
        // });


        // socket.emit("join-room", {
        //   roomId,
        //   name: username,
        // });
      } catch (error) {
        console.log(error);
      }
    };

    startVideo();

    socket.on("offer", async ({ offer }) => {
      // console.log("Offer received");
      console.log("Offer received", socket.id, Date.now());

      await peerConnection.current.setRemoteDescription(offer);

      console.log("Remote description set");

      const answer = await peerConnection.current.createAnswer();

      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", {
        roomId,
        answer,
      });
    });

    socket.on("user-joined", async () => {
      console.log("Another user joined");

      console.log(peerConnection.current.signalingState);

      if (peerConnection.current.signalingState !== "stable") {
        return;
      }

      console.log("Senders:", peerConnection.current.getSenders());

      console.log("Transceivers:", peerConnection.current.getTransceivers());

      const offer = await peerConnection.current.createOffer();

      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", {
        roomId,
        offer,
      });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Answer received");

      await peerConnection.current.setRemoteDescription(answer);

      console.log("Answer remote description set");
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("ICE candidate received");

      await peerConnection.current.addIceCandidate(candidate);
    });

    socket.on("connect", () => {
      setMySocketId(socket.id);
    });

    socket.on("user-left", () => {
      // chatgpt gave another
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socket.on("participants", (users) => {
      console.log("Participants:", users);

      const remoteuser = users.find((user) => {
        return user.id !== socket.id;
      });

      if (remoteuser) {
        setRemoteMuted(remoteuser.muted);
      }

      setParticipants(users);
      // console.log("These are the users: ",users)
    });

    socket.on("room-start-time", (time) => {
      setStartTime(time);
    });

    socket.on("mic-status", ({ muted }) => {
      console.log("Remote mic status:", muted);

      setRemoteMuted(muted);
    });

    // socket.on("receive-message", (messageData) => {
    //   // setMessages((prev) => [...prev, messageData]);

    // });

    socket.on("receive-message", handleMessage);

    socket.on("receive-file", (file) => {
      setMessages((prev) => [...prev, file]);
    });

    socket.on("chat-history", (messages) => {
      setMessages(messages);
    });

    // socket.emit("mic-status", {
    //   roomId,
    //   muted:isMuted,
    // });

    console.log("local user mic mute status:", isMuted);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("user-joined");
      socket.off("ice-candidate");
      socket.off("participants");
      socket.off("user-left");
      socket.off("mic-status");
      socket.off("recieve-message", handleMessage);
      socket.off("chat-history");
      socket.off("receive-file");
      peerConnection.current?.close();
    };
  }, [roomId]);

  // const [seconds, setSeconds] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSeconds((prev) => prev + 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // useEffect(()=>{
  //    socket.emit("mic-status", {
  //     roomId,
  //     muted:isMuted,
  //   });
  // },[]);

  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");

  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");

  const secs = String(seconds % 60).padStart(2, "0");

  // console.log("room.jsx is loaded");

  return (
    <div>
      <div className="bg-[#0D0D0D] text-neutral-50 flex flex-col w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        {/* <div className="flex justify-between items-center h-14 px-6"> */}
        <div className="flex flex-col md:flex-row justify-between items-center px-3 md:px-6 py-2 gap-2">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <Hexagon className="size-6 text-[#00D4FF]" />

            <span className="font-bold text-white text-lg">WeMeet</span>
          </div>

          {/* RIGHT */}
          {/* <div className="flex items-center gap-3"> */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            {/* TIMER */}
            <div className="rounded-full border border-[#00D4FF] px-4 py-1.5 flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#00D4FF] animate-pulse" />

              <span className="font-mono text-[#00D4FF] text-sm">
                {hrs}:{mins}:{secs}
              </span>
            </div>

            {/* COPY */}
            <button
              onClick={copyMeetingLink}
              className="rounded-full bg-[#1A1A2E] border border-[#2A2A2A]
      px-4 py-1.5 flex items-center gap-2 hover:border-[#00D4FF]"
            >
              <Link2 className="size-4 text-[#00D4FF]" />

              <span className="text-white text-sm">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>

            {/* END */}
            <button
              onClick={leaveCall}
              className="rounded-full bg-red-500 text-white
      px-4 py-1.5 flex items-center gap-2"
            >
              <PhoneOff className="size-4" />
              End
            </button>

            {/* SIDEBAR */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-full bg-[#1A1A2E]
      border border-[#2A2A2A]
      p-2 hover:border-[#00D4FF]"
            >
              <Menu className="size-4 text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <VideoGrid
            videoRef={videoRef}
            remoteVideoRef={remoteVideoRef}
            remoteMuted={remoteMuted}
            isMuted={isMuted}
            cameraOff={cameraOff}
            remoteParticipant={remoteParticipant}
            username={sessionStorage.getItem("username")}
          />

          <FloatingTools
            setWhiteboardOpen={setWhiteboardOpen}
            // showCodeEditor={showCodeEditor}
            setShowCodeEditor={setShowCodeEditor}
          />

          {sidebarOpen && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              participants={participants}
              messages={messages}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              sendMessage={sendMessage}
              uploadFile={uploadFile}
              handleFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              uploading={uploading}
            />
          )}
        </div>

        <Control
          isMuted={isMuted}
          toggleMute={toggleMute}
          cameraOff={cameraOff}
          toggleCamera={toggleCamera}
          isSharingScreen={isSharingScreen}
          shareScreen={shareScreen}
          leaveCall={leaveCall}
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
          messages={messages}
          setWhiteboardOpen={setWhiteboardOpen}
        ></Control>

        {whiteboardOpen && (
          <Whiteboard
            roomId={roomId}
            socket={socket}
            onClose={() => setWhiteboardOpen(false)}
          />
        )}

        {showCodeEditor && (
          <CodeEditor
            roomId={roomId}
            socket={socket}
            onClose={() => setShowCodeEditor(false)}
          />
        )}
      </div>
    </div>
  );
}
