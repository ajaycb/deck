import React from "react";

import dynamic from "next/dynamic";

const Ml5 = dynamic(import("../components/Ml5"), { ssr: false });

const TeachableMachine = () => {
  return (
    <div>
      <Ml5 />
    </div>
  );
};

export default TeachableMachine;
