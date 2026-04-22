"use client";

import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function PrintClientButton() {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const element = document.getElementById("prescription-card");
        if (!element) return;
        
        const opt = {
            margin: 0.5,
            filename: `prescription_rx.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <>
            <Button variant="default" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPdf} className="gap-2">
                <FileDown className="h-4 w-4" /> Save PDF
            </Button>
        </>
    );
}
