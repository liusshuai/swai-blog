export default function Empty({ tip, image, actions }: { tip?: string; image?: string; actions?: React.ReactNode }) {
    return (
        <div className="min-h-[200px] text-center">
            <img className="w-28 h-28 object-contain mx-auto" src={image || '/image/sorry.png'} alt="" />
            <p className="text-secondary mt-5 text-sm">{tip}</p>
            {actions ? <div className="mt-5">{actions}</div> : null}
        </div>
    );
}
