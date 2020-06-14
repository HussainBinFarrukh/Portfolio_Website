import React from "react";
import AnimatedCursor from "react-animated-cursor"

export default function App() {
  return (
    <div className="App">
    <AnimatedCursor
      innerSize={15}
      outerSize={40}
      color='199, 199, 199'
      outerAlpha={0.5}
      innerScale={1}
      outerScale={2}
    />
    </div>
  );
}