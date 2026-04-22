"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username,
                password,
            });

            if (result?.error) {
                setError("Invalid username or password");
                setIsLoading(false);
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full select-none cursor-default font-sans bg-background">
            
            {/* Left Panel - Branding */}
            <div className="lg:w-[45%] w-full bg-[#0226D4] flex flex-col items-center justify-center p-12 lg:min-h-screen min-h-[40vh] relative overflow-hidden text-center order-1">
                <div className="max-w-md w-full z-10 flex flex-col items-center animate-fade-in">
                    <div className="w-72 max-w-full h-auto mb-6">
                        <img
                            src="/hop-logo-new.png"
                            alt="House of Puppies Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative order-2 bg-muted/20 dark:bg-muted/10">
                <div className="absolute top-6 right-6">
                    <ModeToggle />
                </div>
                
                <div className="w-full max-w-md">
                    <Card className="w-full border-muted/30 shadow-lg dark:shadow-2xl">
                        <CardHeader className="mb-2">
                            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                            <CardDescription>
                                Enter your credentials to access the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-5">
                                {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2 font-medium">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {error}
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor="username" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="admin"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="username"
                                        className="h-12 bg-background"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</Label>
                                        <a href="#" className="text-[10px] font-bold text-[#004AAD] dark:text-blue-400 hover:text-blue-700 transition uppercase tracking-wider">Forgot?</a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="h-12 bg-background pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 bg-[#004AAD] hover:bg-[#003882] text-white font-bold tracking-widest mt-2" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Logging in...
                                        </div>
                                    ) : (
                                        "SIGN IN"
                                    )}
                                </Button>
                            </form>
                            
                            <div className="mt-8 pt-6 border-t border-border text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Secure System</p>
                                <p className="text-[11px] text-muted-foreground/70 transition-colors">Encrypted Access Protocol</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
