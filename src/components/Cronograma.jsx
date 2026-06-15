// src/components/Cronograma.jsx
import React from "react";

/**
 * props:
 *  - events: [{ id, title, date, status, note }]
 *  - vertical: boolean (vertical vs horizontal)
 */
export default function Cronograma({ events = [], vertical = true }) {
  if (!events.length) {
    return (
      <div className="p-4 bg-white rounded shadow text-gray-500">
        Nenhum evento no cronograma.
      </div>
    );
  }

  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row gap-6 overflow-auto"}`}>
      {events.map((ev, idx) => (
        <div key={ev.id} className="flex items-start gap-4 mb-4">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full ${ev.status === "done" ? "bg-green-600" : ev.status === "inprogress" ? "bg-yellow-500" : "bg-gray-400"}`} />
            {idx !== events.length - 1 && <div className="w-px bg-gray-300 h-8 mt-1" />}
          </div>

          <div className="bg-white p-3 rounded shadow flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-800">{ev.title}</div>
                {ev.note && <div className="text-sm text-gray-500 mt-1">{ev.note}</div>}
              </div>
              <div className="text-sm text-gray-400">{ev.date}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
