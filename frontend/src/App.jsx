import './App.css';
import AllRoutes from './Components/AllRoutes';
// import Navbar from './Components/Navbar';
import { ChatBotModal } from './Pages/ChatBotModal';

function App() {
  return (
    <div className="App">
      {/* <Navbar/> */}
      <AllRoutes/>
      <ChatBotModal/>
    </div>
  );
}

export default App;
