import type { ReactNode } from "react";

interface FormRowProps {
    label: ReactNode;
    required?: boolean;
    children: ReactNode;
}

export default function FormRow({ label, required, children }: FormRowProps) {
    return (
        <div className="flex flex-col border-b border-gray-100 last:border-b-0 pc:flex-row pc:items-stretch">
            <div className="flex shrink-0 items-center gap-1 border-b border-gray-100 bg-sky-light px-5 py-3.5 text-sm font-semibold text-title pc:w-44 pc:border-b-0 pc:border-r pc:text-base">
                {label}
                {required && <span className="text-primary">*</span>}
            </div>
            <div className="flex flex-1 items-center px-4 py-3">
                {children}
            </div>
        </div>
    );
}
