import {construct} from './helpers/construct';
import type {Part} from './helpers/types';

export const getParts = (p: string): Part[] => {
	const parts = [];
	const constructed = construct(p);

	let i = 0;
	for (const fn of constructed.functions) {
		if (!fn) {
			i++;
			continue;
		}

		const properties: Part = {
			start: fn.getPointAtLength(0),
			end: fn.getPointAtLength(
				constructed.partial_lengths[i] - constructed.partial_lengths[i - 1]
			),
			length:
				constructed.partial_lengths[i] - constructed.partial_lengths[i - 1],
			getPointAtLength: fn.getPointAtLength,
			getTangentAtLength: fn.getTangentAtLength,
		};
		i++;
		parts.push(properties);
	}

	return parts;
};
