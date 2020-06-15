import React from "react";
import AnimatedCursor from "react-animated-cursor"

export default function App() {
  return (
    <div className="App">
    <AnimatedCursor
      innerSize={18}
      outerSize={40}
      color='250, 164, 3'
      outerAlpha={0.2}
      innerScale={1}
      outerScale={2}
    />
    </div>
  );
}