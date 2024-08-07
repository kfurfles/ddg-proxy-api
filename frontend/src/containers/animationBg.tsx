import { Ball } from "@/components/foundation/ball";

export function AnimatedBg() {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen"> 
            <Ball size={3} position={{ x: '10vw', y: '80vh' }} grident="green" />

            <Ball size={1} position={{ x: '70vw', y: '7vh' }} grident="pink" />

        </div>
    )
}