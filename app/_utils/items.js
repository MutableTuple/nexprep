import {
  Code2,
  CheckCircle2,
  Clock,
  Trophy,
  LayoutDashboard,
  ListChecks,
  Swords,
  MessageSquare,
  BookOpen,
  ClipboardList,
  Send,
  Bookmark,
  BarChart2,
  Settings,
  Flame,
  ChevronDown,
  CalendarDays,
  Circle,
  CheckCircle,
  ExternalLink,
  Zap,
  Star,
} from "lucide-react";

export const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ListChecks, label: "Problems" },
  { icon: Swords, label: "Contests" },
  { icon: MessageSquare, label: "Discuss" },
  { icon: BookOpen, label: "Study Plan" },
  { icon: ClipboardList, label: "Mock Tests" },
  { icon: Send, label: "Submissions" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: BarChart2, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export const progressData = [
  { date: "12 May", solved: 18 },
  { date: "13 May", solved: 32 },
  { date: "14 May", solved: 48 },
  { date: "15 May", solved: 61 },
  { date: "16 May", solved: 75 },
  { date: "17 May", solved: 98 },
  { date: "18 May", solved: 124 },
];

export const breakdownData = [
  { name: "Accepted", value: 1057, pct: "84.7%", color: "#111" },
  { name: "Wrong Answer", value: 172, pct: "13.8%", color: "#999" },
  { name: "Unattempted", value: 19, pct: "1.5%", color: "#ddd" },
];

export const topics = [
  { name: "Arrays", pct: 78 },
  { name: "Dynamic Programming", pct: 64 },
  { name: "Binary Search", pct: 82 },
  { name: "Graphs", pct: 61 },
  { name: "String", pct: 72 },
];

export const recentActivity = [
  {
    title: "Solved Two Sum",
    tag: "Easy",
    ago: "2m ago",
    xp: "+20 XP",
    done: true,
  },
  {
    title: "Solved 3Sum",
    tag: "Medium",
    ago: "15m ago",
    xp: "+30 XP",
    done: true,
  },
  {
    title: "Attempted Binary Tree Inorder Traversal",
    tag: "Medium",
    ago: "1h ago",
    xp: "+10 XP",
    done: false,
  },
  {
    title: "Solved Best Time to Buy and Sell Stock",
    tag: "Easy",
    ago: "2h ago",
    xp: "+20 XP",
    done: true,
  },
];

export const submissions = [
  {
    problem: "Two Sum",
    status: "Accepted",
    lang: "C++",
    time: "76 ms",
    submitted: "2m ago",
  },
  {
    problem: "3Sum",
    status: "Accepted",
    lang: "C++",
    time: "112 ms",
    submitted: "15m ago",
  },
  {
    problem: "Binary Tree Inorder Traversal",
    status: "Wrong Answer",
    lang: "C++",
    time: "—",
    submitted: "1h ago",
  },
  {
    problem: "Best Time to Buy and Sell Stock",
    status: "Accepted",
    lang: "C++",
    time: "68 ms",
    submitted: "2h ago",
  },
];

export const badges = [
  { label: "100", sub: "Days of Code", icon: <Flame size={18} /> },
  { label: "500", sub: "Problems", icon: <CheckCircle2 size={18} /> },
  { label: "⚡", sub: "Contest Participant", icon: <Zap size={18} /> },
  { label: "★", sub: "Top 10% Rank", icon: <Star size={18} /> },
];
