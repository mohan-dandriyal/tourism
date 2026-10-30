"use client";

import Link from 'next/link';
import { ReactNode } from 'react';

interface PrimaryButtonProps {
    children: ReactNode;
    href: string;
}

const FOCUS_RING =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#252D4A]";

export default function PrimaryButton({ children, href }: PrimaryButtonProps) {
    return (
        <Link
            href={href || ""}
            className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-white bg-[image:var(--grad-sunset)] whitespace-nowrap px-5 py-3.5 text-sm font-medium tracking-[0.01em] text-white shadow-md transition-opacity hover:opacity-95 ${FOCUS_RING}`}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[700%]"
            />
            {children}
        </Link>
    );
}