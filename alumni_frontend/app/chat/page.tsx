"use client"

import { useEffect, useState, useRef } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { chatAPI, connectionAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, Users } from "lucide-react"
import { socket } from "@/lib/socket";

interface ChatUser {
  _id: string
  name: string
  email: string
  role: string
}

interface Message {
  _id: string
  sender: string
  receiver: string
  message: string
  createdAt: string
  isRead: boolean
}

export default function ChatPage() {
  const { user } = useAuth()
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [connections, setConnections] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch chat users and connections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatRes, connRes] = await Promise.all([
          chatAPI.getChatUsers(),
          connectionAPI.getAll(),
        ])
        setChatUsers(chatRes.users || [])

        // Extract connected users
        const connArray = Array.isArray(connRes) ? connRes : (connRes as any)?.connections || []
        const connectedUsers = connArray.map((conn: any) => {
          return conn.requester._id === user?._id ? conn.recipient : conn.requester
        })
        setConnections(connectedUsers)
      } catch (error) {
        console.error("Failed to fetch chat data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id)
      // Mark messages as read
      chatAPI.markAsRead(selectedUser._id).catch(console.error)
    }
  }, [selectedUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
      console.log("Joined socket as:", user._id);
    }
  }, [user]);


  // 🔥 Listen for incoming messages
  useEffect(() => {
    socket.on("new_message", (message) => {
      console.log("📩 New message received:", message);

      if (
        selectedUser &&
        (
          (message.sender === user?._id && message.receiver === selectedUser._id) ||
          (message.sender === selectedUser._id && message.receiver === user?._id)
        )
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [selectedUser, user]);

  const fetchMessages = async (userId: string) => {
    try {
      const msgs = await chatAPI.getMessages(userId)
      setMessages(Array.isArray(msgs) ? msgs : [])
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    setSending(true)
    try {
      const msg = await chatAPI.sendMessage(selectedUser._id, newMessage)
      setMessages((prev) => [...prev, msg as Message])
      setNewMessage("")

      // Add to chat users if not already there
      if (!chatUsers.find(u => u._id === selectedUser._id)) {
        setChatUsers([...chatUsers, selectedUser])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  // Combine chat users and connections, removing duplicates
  const allUsers = [...chatUsers]
  connections.forEach(conn => {
    if (!allUsers.find(u => u._id === conn._id)) {
      allUsers.push(conn)
    }
  })

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Messages
        </h1>

        <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* User List Sidebar */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 overflow-y-auto max-h-[calc(100vh-300px)]">
              {loading ? (
                <p className="text-center text-muted-foreground p-4">Loading...</p>
              ) : allUsers.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">
                  No conversations yet. Connect with people to start chatting!
                </p>
              ) : (
                <div className="space-y-1">
                  {allUsers.map((chatUser) => (
                    <button
                      key={chatUser._id}
                      onClick={() => setSelectedUser(chatUser)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedUser?._id === chatUser._id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                        }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{chatUser.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chatUser.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {chatUser.role}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedUser.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <Badge className="ml-auto">{selectedUser.role}</Badge>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender === user?._id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender === user?._id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                            }`}
                        >
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.sender === user?._id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
