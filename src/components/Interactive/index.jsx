import { useState } from "react";
import { styInput } from "./style";

const Interactive = () => {
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const isSending = status === "sending";
  const isSent = status === "sent";

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    await sendMessage(comment);
    setStatus("sent");
  }

  if (isSent) {
    return (
      <h1
        onClick={() => {
          setStatus("");
        }}
      >
        Makasih kak!
      </h1>
    );
  }

  return (
    <div>
      <form css={styInput} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">Feedbacknya kak: </label>
          <input
            id="comment"
            value={comment}
            name="comment"
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </div>
        <button disabled={isSending} type="submit">
          Send
        </button>
        {isSending && <p>Sending...</p>}
      </form>
    </div>
  );
};

// Pretend to send a message.
function sendMessage() {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

export default Interactive;
