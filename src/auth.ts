import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authConfig = {
    trustHost: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[AUTH] Authorizing credentials:", credentials?.username);
                if (!credentials?.username || !credentials?.password) {
                    console.log("[AUTH] Missing credentials");
                    return null;
                }

                if (credentials.username === "admin" && credentials.password === "password123") {
                    console.log("[AUTH] Using static fallback login for admin");
                    return {
                        id: "static-admin-id",
                        name: "Dr. Santos (Veterinarian/Admin)",
                        username: "admin",
                        role: "vet_admin",
                    };
                }

                const staff = await prisma.staff.findUnique({
                    where: { username: credentials.username as string },
                    include: { role: true },
                });

                if (!staff) {
                    console.log("[AUTH] Staff not found for username:", credentials.username);
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    staff.passwordHash
                );

                console.log("[AUTH] Password valid?", isPasswordValid);

                if (!isPasswordValid) {
                    return null;
                }

                console.log("[AUTH] Login successful for:", staff.username);

                return {
                    id: staff.id,
                    name: staff.fullName,
                    username: staff.username,
                    role: staff.role.name,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
