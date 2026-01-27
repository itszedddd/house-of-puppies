"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot } from "lucide-react";

interface Message {
    role: "user" | "bot";
    text: string;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Hello! I'm Paw-sistent, your BlackJax helper. How can I assist you today?" },
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            const botResponse = generateResponse(input);
            setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
        }, 1000);
    };

    const generateResponse = (query: string): string => {
        const q = query.toLowerCase();
        if (q.includes("book") || q.includes("appointment")) {
            return "I can help with that! Please visit our booking page or call us at (555) 123-4567 to schedule a grooming session.";
        }
        if (q.includes("hours") || q.includes("open")) {
            return "We are open Monday to Saturday, 8:00 AM to 6:00 PM. We are closed on Sundays.";
        }
        if (q.includes("price") || q.includes("cost")) {
            return "Our prices vary by breed and service. A basic bath starts at $30, while full grooming starts at $60.";
        }
        if (q.includes("status")) {
            return "You can check your pet's status by clicking 'Client Portal' in the menu and entering your Ticket ID.";
        }
        return "I'm not sure about that, but our team would love to help! Please call us or visit the shop.";
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="rounded-full h-14 w-14 shadow-lg"
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-80 h-96 shadow-xl flex flex-col">
                    <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg flex flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <CardTitle className="text-base">Paw-sistent</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="p-3 border-t">
                        <form
                            className="flex w-full gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                        >
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
