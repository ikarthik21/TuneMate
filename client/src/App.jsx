import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import routesConfig from "@/utils/routesConfig";

function App() {

  return (
    <>
      <Router>
        <Routes>
          {routesConfig.map((route, index) => (
            <Route
              key={index}
              exact
              path={route?.path}
              element={route?.element}
            />
          ))}
        </Routes>
      </Router>
    </>
  )
}

export default App
