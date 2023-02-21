import { useState } from "react";
import "./App.scss";
import Calendar from "./Components/Calendar";
import "./global.scss";
import "./index.css";
import TaskDetails from "./Components/TaskDetails";
import SubHeader from "./Components/SubHeader";

function App() {
   return (
      <div id="app">
         <SubHeader></SubHeader>
         <Calendar></Calendar>
         <TaskDetails></TaskDetails>
      </div>
   );
}

export default App;
