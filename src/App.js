import React from 'react';

import './App.css';
import Countdown from './Countdown';

const App = () => {

  return (
    <div className="App">
      <Countdown endTimestamp={new Date().getTime()+(42000)} />
    </div>
  );
}

export default App;
