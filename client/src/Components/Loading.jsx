import { HashLoader } from 'react-spinners'

export default function Loading() {
    return (
        <div className="fixed w-full h-screen z-50 top-0 left-0 bg-white flex justify-center items-center">
            <HashLoader
                color="#feab5e"
                size={100}
                speedMultiplier={1.5}
            />
        </div>
    )
}