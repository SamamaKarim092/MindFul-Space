"use client";

import JournalEditor from "@/app/components/journal/JournalEditor";
import JournalEntryList from "@/app/components/journal/JournalEntryList";

export default function JournalPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 h-full overflow-y-auto pr-2 custom-scrollbar">
        <JournalEditor />
      </div>
      <div className="lg:col-span-1 h-full overflow-y-auto pl-2 custom-scrollbar border-l border-white/5">
        <JournalEntryList />
      </div>
    </div>
  );
}
