import { useEffect, useRef } from "react";

export type LogEntry = {
  type: "success" | "error" | "info";
  message: string;
};

type ActionLogProps = {
  logs: LogEntry[];
};

export const ActionLog = ({ logs }: ActionLogProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="
        h-40 w-80 bg-black/30
        text-sm text-start 
        border border-default rounded-lg 
        overflow-y-auto overflow-x-hidden p-2
        "
    >
      {logs.length === 0 && (
        <p className="text-subtle text-center mt-2">No actions yet...</p>
      )}

      {logs.map((log, i) => (
        <p
          key={i}
          className={`log-line ${
            log.type === "success"
              ? "text-green-400"
              : log.type === "error"
                ? "text-red-400"
                : "text-slate-300"
          }`}
        >
          {log.message}
        </p>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
