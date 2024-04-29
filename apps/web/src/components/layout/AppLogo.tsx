import Link from 'next/link';

export default function AppLogo() {
    return (
        <Link className="w-auto" href={'/'}>
            <img className="h-16 tablet:h-20" src="/image/logo.png" alt="LSSHUAISL" />
        </Link>
    );
}
