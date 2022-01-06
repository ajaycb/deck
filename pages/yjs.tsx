import React, { useEffect, useState } from "react";
import * as Y from "yjs";

function useYjs(yElement?: Y.AbstractType<any>) {
  const [x, setX] = useState<any>({ yElement });
  const setter = () => {
    console.log("mutated");
    //force rerender
    setX({ yElement });
  };

  useEffect(() => {
    if (!yElement) return;
    yElement.observe(setter);
    return () => {
      console.log("unob");
      yElement.unobserve(setter);
    };
  }, [yElement]);
}

const Show = ({ arr }: { arr: Y.Array<any> }) => {
  useYjs(arr);

  if (!arr) return null;
  return (
    <div>
      {arr.length}
      <ul>
        {arr.map((el) => (
          <li>{el}</li>
        ))}
      </ul>
    </div>
  );
};
const Yjs = () => {
  const [a, setA] = useState<any>();
  console.log("rendering");
  useEffect(() => {
    const doc = new Y.Doc();
    setA(doc.getArray("arr"));
  }, []);
  const [show, setShow] = useState(true);
  return (
    <div>
      Hi
      <button
        onClick={() => {
          a && a.insert(0, ["Hi"]);
        }}
      >
        add item
      </button>
      <button onClick={() => setShow(!show)}>Show/Hide</button>
      {show && <Show arr={a} />}
    </div>
  );
};
export default Yjs;
