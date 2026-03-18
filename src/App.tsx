import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./components/home";

const CometCanvas = lazy(() => import("./components/cursor/CometCanvas"));

function App() {
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <CometCanvas />
        </Suspense>
      </ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
