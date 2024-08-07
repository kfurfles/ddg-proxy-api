interface Props {
    position: { x: string; y: string }
    grident: 'pink' | 'green',
    size: 1 | 2 | 3
}

export function Ball({ grident, position, size }: Props) {
    const styleSize = size == 1 ? 'w-36 h-36' : size === 2 ? 'w-48 h-48' : 'w-56 h-56'
    return (
        <div style={{ left: position.x, top: position.y }} className={`${grident}-gradient ${styleSize} shadow-2xl floating absolute bg-red-400 rounded-full`} />
    )
}