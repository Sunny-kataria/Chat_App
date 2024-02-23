import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import { Route } from "react-router-dom";
import './App.css';


function App() {
  return (
    <>
    

<div className="Appp">
    <Route path="/" component={HomePage} exact/>
    <Route path="/chats" component={ChatPage}/>
</div>
   
    

    </>
  );
}

export default App;
