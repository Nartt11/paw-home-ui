import Link from "next/link";
import { Bell } from "lucide-react";

type Props = {
  unread: number;
};

export default function NotifBell({ unread }: Props) {
  return (
    <Link
      href="/web/notifications"
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
    >
      <Bell size={17} className="text-white" />

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-ph-red flex items-center justify-center text-white text-[9px] font-bold border-2 border-ph-primary">
          {unread}
        </span>
      )}
    </Link>
  );
}
