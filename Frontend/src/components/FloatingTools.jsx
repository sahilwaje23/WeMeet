import { Pencil, Code2 } from "lucide-react";

export default function FloatingTools({
  setWhiteboardOpen,
  setShowCodeEditor,
}) {
  return (
    // <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
    <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-40">

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-2 flex flex-col gap-2 shadow-xl">

        <button
          onClick={() => setWhiteboardOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1A1A2E] hover:bg-[#22223A] flex items-center justify-center"
        >
          <Pencil className="text-[#00D4FF]" />
        </button>

        <button
          onClick={() => setShowCodeEditor(true)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1A1A2E] hover:bg-[#22223A] flex items-center justify-center"
        >
          <Code2 className="text-[#00D4FF]" />
        </button>

      </div>

    </div>
  );
}