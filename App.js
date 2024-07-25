import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home";
import { SocketProvider } from "./providers/socket";
import Roompage from "./pages/Room";
import { PeerProvider } from "./providers/Peer";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/room/:roomId" element={<Roompage />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
