import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Calendar, ShieldCheck, Star } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-6">
                            <div className="relative w-full max-w-[800px] h-[300px] mx-auto overflow-hidden rounded-xl shadow-2xl animate-in fade-in zoom-in duration-1000">
                                <img
                                    src="/branding.jpg"
                                    alt="House of Puppies Banner"
                                    className="w-full h-full object-cover bg-white"
                                />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                House of Puppies: Complete Veterinary & Grooming Care
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Professional veterinary services, vaccinations, check-ups, and premium grooming for your beloved pets.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button size="lg" asChild>
                                <Link href="/#services">Our Services</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/client">Check Pet Status</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                                Services
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                What We Offer
                            </h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                From basic baths to full grooming packages, we have everything your pet needs to look and feel their best.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Scissors className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Full Grooming</CardTitle>
                                <CardDescription>Complete makeover for your pet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Includes bath, haircut, nail trim, ear cleaning, and styling. Perfect for maintaining a healthy coat.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <ShieldCheck className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Health Check</CardTitle>
                                <CardDescription>Wellness inspection included.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Our groomers are trained to spot skin issues, lumps, or other health concerns during the grooming process.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Star className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Premium Supplies</CardTitle>
                                <CardDescription>Shop the best for your pet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                We stock high-quality food, toys, and accessories. Only the best for our furry clients.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Ready to pamper your pet?
                        </h2>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Book an appointment today or visit our shop to see our selection of premium supplies.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
                        <Button size="lg" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Book Appointment
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/client">Client Portal</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
