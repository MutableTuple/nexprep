"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Check, X, UserMinus } from "lucide-react";
import { useUserId } from "@/app/_lib/AuthProvider";
import { showToast } from "@/app/_lib/toast";
import {
  searchProfiles,
  listFriendships,
  listPendingFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  deleteFriendship,
} from "@/app/_lib/data-service";

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export default function FriendsPage() {
  const { userId } = useUserId();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    if (!userId) return;
    setLoading(true);
    try {
      const [accepted, incoming] = await Promise.all([
        listFriendships(userId, "accepted"),
        listPendingFriendRequests(userId),
      ]);
      setFriends(accepted);
      setPending(incoming);
    } catch (err) {
      console.error("Failed to load friends:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [userId]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const data = await searchProfiles(query.trim());
        if (!cancelled) setResults(data.filter((p) => p.id !== userId));
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, userId]);

  async function handleSendRequest(targetId) {
    try {
      await sendFriendRequest(userId, targetId);
      showToast.success("Request sent", "");
      setResults((prev) => prev.filter((p) => p.id !== targetId));
    } catch (err) {
      showToast.error("Couldn't send request", err.message || "");
    }
  }

  async function handleRespond(id, status) {
    try {
      await respondToFriendRequest(id, status);
      showToast.success(
        status === "accepted" ? "Friend added" : "Request declined",
        "",
      );
      loadAll();
    } catch (err) {
      showToast.error("Couldn't respond", err.message || "");
    }
  }

  async function handleRemove(id) {
    try {
      await deleteFriendship(id);
      showToast.success("Friend removed", "");
      loadAll();
    } catch (err) {
      showToast.error("Couldn't remove friend", err.message || "");
    }
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Sign in to manage friends.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Friends</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find and connect with other JEE aspirants.
          </p>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or name..."
            className="pl-9 h-11 rounded-xl"
          />
        </div>

        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((p) => (
              <Card
                key={p.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                    {getInitials(p.display_name || p.username)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {p.display_name || p.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{p.username}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="gap-1.5 rounded-lg"
                  onClick={() => handleSendRequest(p.id)}
                >
                  <UserPlus size={14} />
                  Add
                </Button>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="friends">
          <TabsList className="rounded-xl h-10">
            <TabsTrigger value="friends" className="rounded-lg text-sm">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="rounded-lg text-sm">
              Requests
              {pending.length > 0 && (
                <Badge className="ml-1.5 h-4 px-1.5 text-[10px]">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-4 flex flex-col gap-2">
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Loading…
              </p>
            ) : friends.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No friends yet — search above to add some.
              </p>
            ) : (
              friends.map((f) => {
                const other = f.sender_id === userId ? f.receiver : f.sender;
                return (
                  <Card
                    key={f.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {getInitials(other?.display_name || other?.username)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {other?.display_name || other?.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{other?.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-lg"
                      onClick={() => handleRemove(f.id)}
                    >
                      <UserMinus size={14} />
                      Remove
                    </Button>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-4 flex flex-col gap-2">
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Loading…
              </p>
            ) : pending.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No pending requests.
              </p>
            ) : (
              pending.map((r) => (
                <Card
                  key={r.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {getInitials(
                        r.profiles?.display_name || r.profiles?.username,
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {r.profiles?.display_name || r.profiles?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{r.profiles?.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      className="gap-1 rounded-lg"
                      onClick={() => handleRespond(r.id, "accepted")}
                    >
                      <Check size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 rounded-lg"
                      onClick={() => handleRespond(r.id, "rejected")}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
