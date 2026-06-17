
import { io } from "socket.io-client";
import {BACKEND_URL }from "../config";


console.log("before socket")

const socket = io(BACKEND_URL);


console.log("after socket");

export default socket;