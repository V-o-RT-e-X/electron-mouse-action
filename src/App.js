import './App.css';
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

function App() {
  const onStart = () => {
    ipcRenderer.send('start',  true)
  }
  const onStop = () => {
    ipcRenderer.send('start', false)
  }
  return (
    <div className="App">
      <button onClick={onStart}>Start</button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
}

export default App;
