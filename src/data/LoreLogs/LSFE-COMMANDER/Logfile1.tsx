import React from "react";

export const LogFile1 = () => (
  <div className="font-mono text-sm leading-relaxed text-green-300  p-4 rounded-lg shadow-md space-y-2 ">
    {/* HEADER */}
    <div className="text-green-500 font-bold tracking-wider">
      ▓▓ SYSTEM LOG: [LOG-A1-LSFE] ▓▓
    </div>
    {/* AUTHOR + TIMESTAMP */}
    <div>{"> USER: LSFE-COMMANDER"}</div>
    <div className="text-xs text-gray-500">
      {"> DATE: 04-11-2167 | FernNet SYNC:"}{" "}
      <span className="text-red-400"> FAILED</span>
    </div>

    {/* WARNING */}
    <div className="text-yellow-400">
      [WARNING] Temporal displacement detected – FernNet synchronization
      unsuccessful.
    </div>

    {/* LOG BODY */}
    <p className="text-gray-300">
      <span className="text-yellow-200">[NOTE]</span> Commander’s Log — Entry
      A1: We&apos;ve landed on *&/|%*&. The terrain is… obedient. Too clean. It
      feels like the planet was waiting for us.
    </p>

    <p className="text-gray-300">
      <span className="text-blue-200">[SCAN]</span> Atmosphere = breathable.
      Composition = unnaturally ideal. Probabilistic analysis suggests external
      engineering. <span className="text-red-400">[ANOMALY]</span>
    </p>

    {/* END */}
    <div className="text-green-500 font-bold tracking-wider">
      ▓▓ LOG COMPLETE ▓▓
    </div>
  </div>
);
