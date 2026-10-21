import React, { useEffect, useRef, useState } from 'react'
import { Badge, IconButton, requirePropFactory, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { secureHeapUsed } from 'crypto';



const server_url = "http://localhost:8080";

var connections = {}

const peerConfigConnections = {
    "iceServers" : [
        { "urls": "stun:stun1.google.com:19302" }
    ]
} 

export default function VideoMeetComponent() {

    var socketRef = useRef();
    var socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let[screen, setScreen] = useState();

    let [showModel, setShowModel] = useState();

    let [screeenAvailable, setScreeenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    //TODO
    // if(isChrome === false) {

    // }

    const getPermissions= async() => {
        try{
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

            if(videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

            if(audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if(navigator.mediaDevices.getDisplayMedia) {
                setScreeenAvailable(true);
            } else {
                setScreeenAvailable(false);
            }

            if(videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });

                if(userMediaStream) {
                    window.localStream = userMediaStream;
                    if(localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }
    }

    let getUserMediaSuccess = (stream) => {}

    let getUserMedia = () => {
        if((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.userMedia({video: video, audio: audio})
            .then(getUserMediaSuccess)
            .then((stream)=>{})
            .catch((e)=>console.log(e));
        } else {
            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(tracks => tracks.stop())
            } catch(e) {

            }
        }
    }

    useEffect(() =>{
        getPermissions();
    }, [])

    useEffect(() =>{
        if(video !== undefined || audio !== undefined) {
            getUserMedia();
        }
    })

    //Todo
    let gotMessageFromServer = (fromId, message) => {

    }

    let connectToSocketServer = () => {
        socketRef.current = iconButtonClasses.connect(server_url, {secure: false})

        socketRef.current.on('signal', gotMessageFromServer)
        
        socketRef.current.on("connect", () => {
            socketRef.emit("join-call", window.location.href)

            socketIdRef.current = socketRef.current.id

            socketRef.current.on("chat-message", addMessage)

            socketRef.current.on("user-left", (id) => {
                setVideo((videos) => videos.filter((video)=>video.socketId !== id))
            })

            socketRef.current.on("user-joined", (id, clients)=> {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections(socketListId).onicecandidate = (event) => {
                        if(event.candidate !== null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({'ice': event.candidate}))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.fin(video => video.socketId === socketListId);

                        if(videoExists) {
                            setVideo(videos => {
                                const updatedVideos = videos.map(video => 
                                    video.socketId === socketListId ? {...video, stream: event.stream} : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos
                            })
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            }

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos
                                return updatedVideos;
                            });
                        }
                    };

                    if(window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        // let blackSilence
                    }
                })

                if(id === socketIdRef.current) {

                    for(let id2 in connections) {
                        if(id2 === socketIdRef.current) continue
                        try {
                            connections[id2].addStream(window.localStream);
                        } catch(e) {
                            connections[id2].createOffer().then((description) => {
                                connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit("signal", id2, JSON.stringify({"sdp": connections[id2].localDescription}))
                                })
                                .catch(e => console.log(e))
                            })
                        }
                    }
                }
            })
        })
    }

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        
        connectToSocketServer();
    }

    return (
        <div>
            {askForUsername ? (
                <div>
                    <h2>Enter into Lobby</h2>
                    <TextField 
                    id="outlined-basic" 
                    label="Username" 
                    value={username} 
                    onChange={e = setUsername(e.target.value)} 
                    variant="outlined" />
                    <Button variant="contained" onClick={connect}>Connect</Button>

                    <div>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>


                </div>) : <></>
            }
        </div>
    );
}