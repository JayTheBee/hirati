import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Tasks from "./pages/Tasks"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            {/* {user && <Route path="/" exact element={<Main />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} /> */}
            <Route path="/tasks" exact element={<Tasks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
