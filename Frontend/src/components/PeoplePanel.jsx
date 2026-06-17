export default function PeoplePanel({ participants }) {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="bg-[#1A1A2E] p-3 rounded-lg mb-2"
        >
          {participant.name}
        </div>
      ))}
    </div>
  );
}