export default function Alert({ children, isError }: { children: React.ReactNode; isError: boolean }) {
    return (
        <div className={`border-2 ${isError ? "border-code-red-1" : "border-code-green-1"} font-title select-none p-2 my-2`}>
            {children}
        </div>
    );
}
