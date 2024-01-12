/** @jsxImportSource react */
import clsx from 'clsx';
import type { TestCase } from './test-cases';
import type { BenchResultsType, BenchmarkType } from 'react-component-benchmark';

export interface ResultEntry {
	result: BenchResultsType;
	type: BenchmarkType;
	component: TestCase;
}

function ms(value: number | void) {
	return typeof value !== 'undefined' ? <>{value.toFixed(3)}ms</> : null;
}

export default function Results({ results }: { results: Array<ResultEntry> }) {
	return (
		<table className="w-full border-collapse border border-slate-900 text-sm dark:border-slate-600 md:text-base">
			<thead>
				<tr>
					<th title="Run" className={clsx(headerClasses, cellClasses)}>
						#
					</th>
					<th className={clsx(headerClasses, cellClasses)}>Benchmark</th>
					<th className={clsx(headerClasses, cellClasses)}>mean</th>
					<th className={clsx(headerClasses, cellClasses)}>layout</th>
					<th className={clsx(headerClasses, cellClasses)}>p95</th>
					<th className={clsx(headerClasses, cellClasses)}>p99</th>
				</tr>
			</thead>
			<tbody>
				{[...results].reverse().map((result, i) => (
					<Result key={i} index={results.length - i} {...result} />
				))}
			</tbody>
		</table>
	);
}

export function Result({ component, index, type, result }: ResultEntry & { index: number }) {
	return (
		<tr>
			<th className={clsx(cellClasses, dataClasses)}>{index}</th>
			<th className={clsx(cellClasses, 'text-left')}>
				{component}
				<span className="block text-xs font-normal">{type}</span>
			</th>
			<td className={clsx(cellClasses, dataClasses)}>
				{ms(result.mean)} (±{ms(result.stdDev)})
			</td>
			<td className={clsx(cellClasses, dataClasses)}>{ms(result.layout?.mean)}</td>
			<td className={clsx(cellClasses, dataClasses)}>{ms(result.p95)}</td>
			<td className={clsx(cellClasses, dataClasses)}>{ms(result.p99)}</td>
		</tr>
	);
}

const headerClasses = '';
const cellClasses = 'py-2 px-4 border border-slate-600 dark:border-slate-700';
const dataClasses = 'font-mono text-right';
