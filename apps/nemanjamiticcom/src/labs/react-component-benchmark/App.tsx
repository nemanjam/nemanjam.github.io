/** @jsxImportSource react */
import * as React from 'react';
import clsx from 'clsx';
import { Benchmark } from 'react-component-benchmark';
import type { BenchmarkRef, BenchResultsType, BenchmarkType } from 'react-component-benchmark';
import Results from './Result';
import { TestCases } from './test-cases';
import type { TestCase } from './test-cases';
import type { ResultEntry } from './Result';

export default function BenchmarkHome() {
	const benchmarkRef = React.createRef<BenchmarkRef>();
	const [benchmarkType, setBenchmarkType] = React.useState<BenchmarkType>('mount');
	const [componentName, setComponent] = React.useState<TestCase>('Sierpinski');
	const [samples, setSamples] = React.useState(50);
	const [running, setRunning] = React.useState(false);
	const [results, dispatch] = React.useReducer(resultsReducer, [] as Array<ResultEntry>);

	const handleComplete = (result: BenchResultsType) => {
		dispatch({ result, type: benchmarkType, component: componentName });
		setRunning(false);
	};

	const handleChangeComponent = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setComponent(event.target.value as TestCase);
	};

	const handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setBenchmarkType(event.target.value as BenchmarkType);
	};

	const handleStart = () => {
		setRunning(true);
		benchmarkRef.current?.start();
	};

	const handleClear = () => {
		dispatch('CLEAR');
	};

	const handleChangeSamples = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value, 10);
		if (!isNaN(value)) {
			setSamples(value);
		}
	};

	return (
		<div className="grid w-full grid-cols-12 gap-8 rounded bg-slate-200 p-8 text-slate-900 dark:bg-slate-800 dark:text-white">
			<div className="col-span-12 flex flex-col gap-8 overflow-hidden lg:col-span-9">
				<div className="flex flex-row flex-wrap items-end justify-items-stretch gap-4 md:gap-8">
					<label className="flex grow flex-col gap-y-1">
						Component
						<select disabled={running} onChange={handleChangeComponent} className={inputClasses}>
							{Object.keys(TestCases).map((name) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					</label>
					<label className="flex grow flex-col gap-y-1">
						Benchmark type
						<select disabled={running} onChange={handleChangeType} className={inputClasses}>
							{['mount', 'update', 'unmount'].map((name) => (
								<option key={name}>{name.toLowerCase()}</option>
							))}
						</select>
					</label>
					<label className="flex grow flex-col gap-y-1">
						Samples
						<input
							className={inputClasses}
							disabled={running}
							type="number"
							min={25}
							max={1000}
							step={25}
							value={samples}
							onChange={handleChangeSamples}
						/>
					</label>

					<div className="flex flex-row-reverse gap-8">
						<button className={clsx(buttonClasses, primaryButton)} disabled={running} onClick={handleStart}>
							Start
						</button>
						<button
							className={clsx(buttonClasses, secondaryButton)}
							disabled={running || results.length === 0}
							onClick={handleClear}
						>
							Clear
						</button>
					</div>
				</div>

				<div className="relative grow overflow-x-scroll">
					<h3 className="text-2xl font-bold">Results</h3>
					{results.length ? <Results results={results} /> : <p>Run a benchmark to see results</p>}
				</div>
			</div>

			<div className="col-span-12 rounded-lg bg-slate-50 p-12 dark:bg-slate-200 dark:text-slate-900 lg:col-start-10">
				<Benchmark
					key={`${TestCases[componentName].component}-${benchmarkType}-${results.length}`}
					component={TestCases[componentName].component}
					componentProps={TestCases[componentName].props}
					includeLayout
					onComplete={handleComplete}
					ref={benchmarkRef}
					samples={samples}
					timeout={10000}
					type={benchmarkType}
				/>
			</div>
		</div>
	);
}

function resultsReducer(state: Array<ResultEntry>, results: 'CLEAR' | ResultEntry) {
	if (results === 'CLEAR') {
		return [];
	}
	return [...state, results];
}

const inputClasses =
	'px-2 h-8 border border-slate-400 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded outline-none focus-visible:ring-4 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/20';
const buttonClasses =
	'whitespace-nowrap rounded py-2 px-4 font-bold outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/20 disabled:opacity-50';
const secondaryButton = 'text-slate-700 bg-slate-300 hover:bg-slate-400';
const primaryButton = 'text-blue-100 bg-blue-700 hover:bg-blue-800';
