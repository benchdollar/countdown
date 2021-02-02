import './App.css';
import Countdown from './Countdown';

function App() {
  return (
    <div className="App">
      <Countdown endTimestamp={new Date().getTime()+(42.002*3600*1000)}/>
    </div>
  );
}

export default App;
