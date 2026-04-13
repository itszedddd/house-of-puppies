"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    return (
        <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 cursor-pointer"
            onClick={() => signOut({ callbackUrl: '/login' })}
        >
            <LogOut className="h-4 w-4" />

        </Button>
    );
}
