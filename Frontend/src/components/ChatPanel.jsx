export default function ChatPanel({
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
  uploadFile,
  handleFileSelect,
  selectedFile,
  uploading,
}) {
  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {messages.length === 0 && (
          <div className="text-center text-white/40 text-sm mt-10">
            No messages yet
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-[#1A1A2E] border border-[#2A2A2A] rounded-xl p-3"
          >
            <p className="text-[#00D4FF] text-xs font-semibold mb-2">
              {msg.sender}
            </p>

            {/* FILE MESSAGE */}
            {msg.fileUrl ? (
              <div className="space-y-2">

                {/* image preview */}
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                  msg.fileName || ""
                ) && (
                  <img
                    src={msg.fileUrl}
                    alt={msg.fileName}
                    className="rounded-lg max-h-56 w-full object-cover"
                  />
                )}

                <div className="bg-[#111111] rounded-lg p-2 text-sm text-white break-all">
                  📎 {msg.fileName}
                </div>

                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#00D4FF] hover:text-cyan-300 text-sm underline"
                >
                  Open File ↗
                </a>
              </div>
            ) : (
              <p className="text-white text-sm break-words">
                {msg.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A2A2A] p-3 space-y-3">

        {/* File Upload */}
        <div className="flex gap-2">

          <label className="flex-1 cursor-pointer bg-[#1A1A2E] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white overflow-hidden whitespace-nowrap text-ellipsis hover:border-[#00D4FF] transition">

            {selectedFile
              ? selectedFile.name.length > 25
                ? selectedFile.name.slice(0, 25) + "..."
                : selectedFile.name
              : "Select File"}

            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>

          <button
            onClick={uploadFile}
            disabled={!selectedFile || uploading}
            className="bg-[#00D4FF] text-black font-semibold px-4 rounded-lg hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </div>

        {/* Message Box */}
        <div className="flex gap-2">

          <input
            value={messageInput}
            placeholder="Type a message..."
            onChange={(e) =>
              setMessageInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="flex-1 bg-[#1A1A2E] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00D4FF]"
          />

          <button
            onClick={sendMessage}
            className="bg-[#00D4FF] text-black font-semibold px-4 rounded-lg hover:bg-cyan-400 transition"
          >
            Send
          </button>

        </div>
      </div>

    </div>
  );
}