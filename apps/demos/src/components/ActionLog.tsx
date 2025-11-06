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

  // auto-scroll to bottom when a new log appears
  /* // cool idea for another time  
    useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);
    */
  return (
    <div className="overflow-y-auto text-sm p-2">
      {logs.length === 0 && (
        <p className="text-subtle text-center mt-2">No actions yet...</p>
      )}

      {logs.map((log, i) => (
        <p
          key={i}
          className={
            log.type === "success"
              ? "text-green-400"
              : log.type === "error"
                ? "text-red-400"
                : "text-slate-300"
          }
        >
          {log.message}
        </p>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
