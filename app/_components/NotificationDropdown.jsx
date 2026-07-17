"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserId } from "../_lib/AuthProvider";
import { useNotifications } from "../_lib/use-notifications";
import { Bell, UserPlus, UserCheck, Swords } from "lucide-react";

const ICONS = {
  friend_request: UserPlus,
  friend_accepted: UserCheck,
  new_follower: UserPlus,
  duel_challenge: Swords,
  duel_matched: Swords,
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsDropdown() {
  const { userId } = useUserId();
  const { notifications, unreadCount, markAllRead } = useNotifications(userId);
  const [open, setOpen] = useState(false);

  async function handleOpenChange(next) {
    setOpen(next);
    if (next) await markAllRead();
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto flex flex-col">
            {notifications.map((n) => {
              const Icon = ICONS[n.type] ?? Bell;
              return (
                <Link
                  key={n.id}
                  href="/friends"
                  className={`flex items-start gap-2.5 px-2 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors ${
                    !n.read ? "bg-accent/40" : ""
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="leading-snug">
                      <span className="font-semibold">
                        {n.actor?.display_name ||
                          n.actor?.username ||
                          "Someone"}
                      </span>{" "}
                      {n.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
