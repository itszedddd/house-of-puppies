"use client";

import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";

export default function PrintClientButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Button variant="default" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2">
                <FileDown className="h-4 w-4" /> Save PDF
            </Button>
        </>
    );
}
