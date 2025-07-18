import { Message } from "./types";

export const users = [
  {
    id: "1",
    name: "Pedrik Ronner",
    status: "Active now",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "",
  },
  {
    id: "2",
    name: "Elena Ivanova",
    status: "Project Head",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "Project Head",
  },
  {
    id: "3",
    name: "Marie Wondy",
    status: "Project Manager",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "Project Manager",
  },
  {
    id: "4",
    name: "Oskar Jansson",
    status: "Design Head",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "Design Head",
  },
  {
    id: "5",
    name: "Nora Jensen",
    status: "UX Writer",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "UX Writer",
  },
  {
    id: "6",
    name: "Harry Fettel",
    status: "Online",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "",
  },
  {
    id: "7",
    name: "Jenny Li",
    status: "Online",
    avatar: "/placeholder.svg?height=48&width=48",
    role: "",
  },
  {
    id: "8",
    name: "Frank Garcia",
    status: "Online",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "",
  },
  {
    id: "9",
    name: "Maria Gonzalez",
    status: "Online",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "",
  },
  {
    id: "10",
    name: "Maria Jeremy",
    status: "Online",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "",
  },
  {
    id: "11",
    name: "Ted Brother",
    status: "Online",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "",
  },
  {
    id: "12",
    name: "Lili Wilson",
    status: "Online",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "",
  },
];

export const chatMessages = [
  {
    id: "m1",
    senderId: "3",
    content: "Hey mate, how's all going?",
    timestamp: "2023-07-28T10:00:00Z",
    type: "text",
  },
  {
    id: "m2",
    senderId: "1",
    content:
      "Yeah, everything good!\nWhat's your project update? Are you having any trouble?",
    timestamp: "2023-07-28T10:05:00Z",
    type: "text",
  },
  {
    id: "m3",
    senderId: "3",
    content: "No, going all perfect! Let me show you images of the project.",
    timestamp: "2023-07-28T10:10:00Z",
    type: "text",
  },
  {
    id: "m4",
    senderId: "3",
    content: "Look at these!!",
    timestamp: "2023-07-28T10:11:00Z",
    type: "text",
  },
  {
    id: "m5",
    senderId: "3",
    content: "/placeholder.svg?height=100&width=100",
    timestamp: "2023-07-28T10:12:00Z",
    type: "image",
  },
  {
    id: "m6",
    senderId: "3",
    content: "/placeholder.svg?height=100&width=100",
    timestamp: "2023-07-28T10:12:00Z",
    type: "image",
  },
  {
    id: "m7",
    senderId: "1",
    content: "Wow! These are Great.",
    timestamp: "2023-07-28T10:15:00Z",
    type: "text",
  },
] as Message[];

export const desktopChatList = [
  {
    id: "c1",
    name: "Office chat",
    lastMessage: "I want to ask you to pick...",
    time: "4 m",
    unread: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c2",
    name: "Harry Fettel",
    lastMessage: "Our company needs to prepare",
    time: "15 m",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c3",
    name: "Frank Garcia",
    lastMessage: "Our company needs to prepare",
    time: "9:31 am",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c4",
    name: "Maria Gonzalez",
    lastMessage: "Our company needs to prepare",
    time: "24 m",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c5",
    name: "Maria Jeremy",
    lastMessage: "Our company needs to prepare",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c6",
    name: "Ted Brother",
    lastMessage: "Our company needs to prepare",
    time: "9:31 am",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c7",
    name: "Jenny Li",
    lastMessage: "Our company needs to prepare",
    time: "9:52 am",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "c8",
    name: "Lili Wilson",
    lastMessage: "Our company needs to prepare",
    time: "5 m",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export const desktopChatMessages = [
  {
    id: "dm1",
    senderId: "6",
    content: "/placeholder.svg?height=200&width=300",
    timestamp: "2023-07-28T10:00:00Z",
    type: "image",
  },
  {
    id: "dm2",
    senderId: "7",
    content: "0:36, 2.0 MB",
    timestamp: "2023-07-28T10:05:00Z",
    type: "audio",
  },
  {
    id: "dm3",
    senderId: "8",
    content: "We will start celebrating Oleg's birthday soon",
    timestamp: "2023-07-28T10:10:00Z",
    type: "text",
  },
  {
    id: "dm4",
    senderId: "6",
    content: "We're already starting, hurry up if it's late",
    timestamp: "2023-07-28T10:11:00Z",
    type: "text",
  },
  {
    id: "dm5",
    senderId: "12",
    content: "I'm stuck in traffic, I'll be there a little later",
    timestamp: "2023-07-28T10:15:00Z",
    type: "text",
  },
] as Message[];

export const chatDetailsMedia = [
  {
    id: "media1",
    type: "image",
    url: "/images/sh.png",
    time: "01:56",
  },
  {
    id: "media2",
    type: "image",
    url: "/images/player.png",
    time: "01:56",
  },
  {
    id: "media3",
    type: "image",
    url: "/images/re-up.png",
    time: "01:56",
  },
];

export const chatDetailsFiles = [
  {
    id: "file1",
    name: "Contract for the provision of printing services",
    icon: "file",
  },
  {
    id: "file2",
    name: "Changes in the schedule of the department of material...",
    icon: "file",
  },
];

export const chatDetailsLinks = [
  {
    id: "link1",
    name: "Economic Policy",
    url: "https://vm/economic-policy",
    icon: "link",
  },
  {
    id: "link2",
    name: "Microsoft",
    url: "https://microsoft.com/",
    icon: "link",
  },
  {
    id: "link3",
    name: "Contact Information",
    url: "https://vm/contact-information",
    icon: "link",
  },
  {
    id: "link4",
    name: "Official Guide to Government",
    url: "https://usa.gov/",
    icon: "link",
  },
];
