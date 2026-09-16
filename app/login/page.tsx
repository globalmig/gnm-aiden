import NomalLoginForm from "@/components/auth/NomalLoginForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-5">
            <div className="card w-full max-w-sm p-8">
                <h1 className="text-center text-xl font-bold text-title">ADMIN</h1>
                <p className="mt-2 text-center text-base text-body">관리자 계정으로 로그인해주세요.</p>

                <div className="mt-8">
                    <NomalLoginForm />
                </div>
            </div>
        </div>
    );
}
