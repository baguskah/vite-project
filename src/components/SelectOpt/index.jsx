import { useState } from "react";
import { styInput, styUpdateBtn, styBtn } from "./style";

const initialItems = [
  { title: "Option A", id: 0 },
  { title: "Option B", id: 1 },
  { title: "Option C", id: 2 },
];

const updatedItems = [
  { title: "Option New A", id: 0 },
  { title: "Option New B", id: 1 },
  { title: "Option New C", id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find((item) => item.id === selectedId);

  function handleChoose(item) {
    setSelectedId(item.id);
  }

  function handleUpdate() {
    setItems(updatedItems);
  }

  return (
    <div css={styInput}>
      <h2>Menu</h2>
      <button css={styUpdateBtn} onClick={handleUpdate}>
        Update Menu
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title}
            <button
              css={styBtn}
              onClick={() => {
                handleChoose(item);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>Saya memilih: {selectedItem.title}.</p>
    </div>
  );
}
