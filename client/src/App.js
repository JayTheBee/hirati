import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Tasks from "./pages/Tasks"
import CodeEditor from "./pages/Editor"
// import Dummy from "./pages/Dummy"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>

            <Route path="/tasks" exact element={<Tasks />} />
            <Route path="/editor" exact element={<CodeEditor />} />
            {/* <Route path="/dummy" exact element={<Dummy />} /> */}

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
