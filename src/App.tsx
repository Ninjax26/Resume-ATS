import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";

const CometCanvas = lazy(() => import("./components/cursor/CometCanvas"));

function App() {
  return (
    <Suspense fallback={null}>
      <>
        <CometCanvas />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
