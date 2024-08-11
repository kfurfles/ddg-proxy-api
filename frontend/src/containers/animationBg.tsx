import { Ball } from "@/components/foundation/ball";

export function AnimatedBg() {
    return (
        <div className="fixed z-0 top-0 left-0 w-screen h-screen pointer-events-none"> 
            <div className="invisible lg:visible">
                <Ball size={3} position={{ x: '10vw', y: '80vh' }} grident="green" />
            </div>

            <div className="invisible lg:visible">
                <Ball size={1} position={{ x: '85vw', y: '7vh' }} grident="pink" />
            </div>

        </div>
    )
}