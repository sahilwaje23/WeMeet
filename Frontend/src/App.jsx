import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Room from "./pages/Room";
import Lobby from "./pages/Lobby";
import MeetingRoom from "./pages/MeetingRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/room/:roomId/lobby" element={<Lobby />} />

        <Route path="/room/:roomId" element={<Room />} />
        {/* <Route path="/room/:roomId/meeting" element={<MeetingRoom />} /> */}
      </Routes>

    </BrowserRouter>
  );
}

export default App;
