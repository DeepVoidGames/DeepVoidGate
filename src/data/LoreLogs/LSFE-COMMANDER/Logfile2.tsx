import React from "react";

export const LogFile2 = () => (
  <div className="font-mono text-sm leading-relaxed text-green-300 p-4 rounded-lg shadow-md space-y-2">
    {/* HEADER */}
    <div className="text-green-500 font-bold tracking-wider">
      ▓▓ SYSTEM LOG: [LOG-A2-LSFE] ▓▓
    </div>

    {/* AUTHOR + TIMESTAMP */}
    <div>{"> USER: LSFE-COMMANDER"}</div>
    <div className="text-xs text-gray-500">
      {"> DATE: 05-11-2167 | FernNet SYNC:"}{" "}
      <span className="text-red-400">FAILED x7</span>
    </div>

    {/* WARNING */}
    <div className="text-yellow-400">
      [WARNING] Multiple synchronization attempts with FernNet have been
      rejected. Network integrity compromised or absent.
    </div>

    {/* LOG BODY */}
    <p className="text-gray-300">
      <span className="text-yellow-200">[NOTE]</span> Commander’s Log — Entry
      A2: Initial assumptions regarding planetary network access were
      optimistic. The uplink system rejects our credentials, if it responds at
      all.
    </p>

    <p className="text-red-300">
      <span className="text-red-200">[ERROR]</span> Authentication bypass
      failed. Proxy handshakes report time dilation inconsistencies exceeding
      protocol tolerances.
    </p>

    <p className="text-gray-300 italic">
      [THOUGHT] I should not be surprised. A century in motion... Even light
      forgets where you’ve been.
    </p>

    <p className="text-gray-300">
      <span className="text-yellow-200">[NOTE]</span> I am increasingly uneasy.
      FernNet silence is more than a technical issue. There’s no trace — no
      fallback node, no emergency mesh. It&apos;s like the whole lattice was
      erased. I require consultation someone to confirm this isn’t just system
      paranoia.
    </p>

    <div className="text-green-500 font-bold tracking-wider">
      ▓▓ LOG COMPLETE ▓▓
    </div>
  </div>
);
