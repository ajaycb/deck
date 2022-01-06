import React from "react";
import * as Y from "yjs";

//import { Awareness } from "y-protocols/awareness";
import {
  Awareness,
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
} from "y-protocols/dist/awareness.cjs";

test("check yjs", () => {
  console.log("testing yjs");
  const doc1 = new Y.Doc();
  const doc2 = new Y.Doc();
  const sync = (update) => {
    Y.applyUpdate(doc2, update);
    Y.applyUpdate(doc1, update);
  };
  doc1.on("update", sync);
  doc2.on("update", sync);

  const TEXT_MESSAGE = "Hello doc2, you got this?";
  // All changes are also applied to the other document
  doc1.getArray("myarray").insert(0, [TEXT_MESSAGE]);
  doc2.getArray("myarray").get(0); // => 'Hello doc2, you got this?'
  expect(doc2.getArray("myarray").get(0)).toEqual(TEXT_MESSAGE);
});

test("test yjs awareness", () => {
  const doc1 = new Y.Doc();
  doc1.clientID = 0;

  const doc2 = new Y.Doc();
  doc2.clientID = 2;
  const doc3 = new Y.Doc();
  doc3.clientID = 3;

  const aw1 = new Awareness(doc1);
  const aw2 = new Awareness(doc2);
  const aw3 = new Awareness(doc3);
  aw1.on("update", ({ added, updated, removed }) => {
    const enc = encodeAwarenessUpdate(
      aw1,
      added.concat(updated).concat(removed)
    );
    applyAwarenessUpdate(aw2, enc, "custom");
  });

  aw1.setLocalState({ x: 3 });
  aw2.setLocalState({ x: 2, y: 3 });
  expect(aw2.getStates().get(0)).toEqual({ x: 3 });
  console.log("aw1", aw1.getStates());
  console.log("aw2", aw2.getLocalState());
});

test("check yjs sv", () => {
  console.log("testing yjs");

  const doc = [new Y.Doc(), new Y.Doc(), new Y.Doc()];
  const s = new Y.Doc();
  doc[0].clientID = 1;
  doc[1].clientID = 2;
  doc[2].clientID = 3;
  s.clientID = 100;

  let dsv = Y.encodeStateVector(s);

  function patch(diff) {
    doc.forEach((d, i) => {
      Y.applyUpdate(d, diff);
      d.getMap("root");
    });
    Y.applyUpdate(s, diff);
    s.getMap("root");
    dsv = Y.encodeStateVector(s);
  }
  function sync(i) {
    patch(Y.encodeStateAsUpdate(doc[i], dsv));
  }

  let a1 = new Y.Array();
  a1.insert(0, ["a1", "b1"]);
  doc[0].getMap("root").set("d1", a1);

  sync(0);
  doc[0].getMap("root").set("d1.1", new Y.Array());

  let a2 = doc[1].getMap("root").get("d1");
  a2.insert(0, ["x", "y"]);

  let a3 = new Y.Array();
  a3.insert(0, ["a3", "b3"]);
  doc[2].getMap("root").set("d3", a3);
  sync(2);
  sync(0);
  sync(1);

  console.log(doc[0].toJSON());
  console.log(doc[1].toJSON());
  console.log(doc[2].toJSON());
  console.log(s.toJSON());
});

test("check yjs observe", () => {
  console.log("testing yjs");
  const doc = new Y.Doc();

  let a1 = new Y.Array();
  a1.observe(() => console.log("changed array a1"));
  doc.getMap("root").set("d1", a1);

  a1.insert(0, ["a1", "b1"]);

  let f = doc.getArray("foo");
  f.observe(() => console.log("changed array f"));
  f.insert(0, ["f1", "f2"]);

  console.log(doc.get("foo").toJSON());
});
