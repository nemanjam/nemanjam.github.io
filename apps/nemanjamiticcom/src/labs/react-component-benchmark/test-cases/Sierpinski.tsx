/** @jsxImportSource react */
import clsx from 'clsx';

interface Props {
	size?: number;
}

const targetSize = 10;

export function Sierpinski({ size = 200 }: Props) {
	const initSize = size / 2;

	return (
		<div className="relative aspect-video overflow-visible" style={{ left: size, top: initSize, width: size * 2 }}>
			<Inner size={initSize} x={0} y={-initSize / 2} />
			<Inner size={initSize} x={-initSize} y={initSize / 2} />
			<Inner size={initSize} x={initSize} y={initSize / 2} />
		</div>
	);
}

interface InnerProps {
	size: number;
	x: number;
	y: number;
}

export function Inner({ size, x = 0, y = 0 }: InnerProps) {
	if (size <= targetSize) {
		const color = colors[Math.abs(Math.round(x)) % colors.length] || colors[0];
		return <Triangle color={color as string} size={targetSize} x={x - targetSize / 2} y={y - targetSize / 2} />;
	}

	const initSize = size / 2;

	return (
		<>
			<Inner size={initSize} x={x} y={y - initSize / 2} />
			<Inner size={initSize} x={x - initSize} y={y + initSize / 2} />
			<Inner size={initSize} x={x + initSize} y={y + initSize / 2} />
		</>
	);
}

function Triangle({ color, size, x, y }: { color: string; size: number; x: number; y: number }) {
	return (
		<div
			className={clsx('absolute h-0 w-0 border-transparent', color)}
			style={{
				marginLeft: x,
				marginTop: y,
				borderRightWidth: size / 2,
				borderBottomWidth: size / 2,
				borderLeftWidth: size / 2,
			}}
		/>
	);
}

const colors = [
	'border-b-red-500',
	'border-b-orange-500',
	'border-b-amber-500',
	'border-b-yellow-500',
	'border-b-lime-500',
	'border-b-green-500',
	'border-b-emerald-500',
	'border-b-teal-500',
	'border-b-cyan-500',
	'border-b-sky-500',
	'border-b-blue-500',
	'border-b-indigo-500',
	'border-b-violet-500',
	'border-b-purple-500',
	'border-b-fuchsia-500',
	'border-b-pink-500',
	'border-b-rose-500',
];
