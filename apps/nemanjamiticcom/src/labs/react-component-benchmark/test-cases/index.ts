/** @jsx react-jsx */
/** @jsxImportSource react */
import { Fast } from './Fast';
import { Sierpinski } from './Sierpinski';
import { SlowMount, SlowUpdate, SlowUnmount } from './Slow';

export const TestCases = {
	Sierpinski: { component: Sierpinski, props: {} },
	'Slow mount': { component: SlowMount, props: {} },
	'Slow update': { component: SlowUpdate, props: {} },
	'Slow unmount': { component: SlowUnmount, props: {} },
	'Fast all': { component: Fast, props: {} },
} as const;

export type TestCase = keyof typeof TestCases;
