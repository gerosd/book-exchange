import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { getCurrentUser } from "@/lib/actions/auth";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["cyrillic"],
});

export const metadata: Metadata = {
    title: "Система обмена книгами",
    description: "Система для обмена книгами между читателями",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();

    return (
        <html lang="ru">
            <body className={`${montserrat.variable} antialiased bg-gray-50 min-h-screen`}>
                <Navigation user={user} />
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </body>
        </html>
    );
}