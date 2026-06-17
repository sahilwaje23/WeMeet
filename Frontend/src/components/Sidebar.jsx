import ChatPanel from "./ChatPanel";
import PeoplePanel from "./PeoplePanel";

export default function Sidebar({
  activeTab,
  setActiveTab,
  participants,
  messages,

  messageInput,
  setMessageInput,
  sendMessage,

  uploadFile,
  handleFileSelect,
  selectedFile,
  uploading
}) {
  return (
    <div className="w-80 bg-[#0F0F16] border-l border-[#2A2A2A] flex flex-col">
      <div className="flex border-b border-[#2A2A2A]">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 p-3 ${
            activeTab === "chat" ? "bg-[#1A1A2E] text-[#00D4FF]" : "text-white"
          }`}
        >
          Chat
        </button>

        <button
          onClick={() => setActiveTab("people")}
          className={`flex-1 p-3 ${
            activeTab === "people"
              ? "bg-[#1A1A2E] text-[#00D4FF]"
              : "text-white"
          }`}
        >
          People
        </button>
      </div>

      {activeTab === "chat" && (
        <ChatPanel
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
          uploadFile={uploadFile}
          handleFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          uploading={uploading}
        />
      )}

      {activeTab === "people" && <PeoplePanel participants={participants} />}
    </div>
  );
}
