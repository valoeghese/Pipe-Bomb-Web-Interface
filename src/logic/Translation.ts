import { ReactNode, isValidElement, cloneElement } from "react";

/**
 * Represents a translation that hasn't been resolved to a specific string based on the content yet.
 */
export default class Translation {
	public constructor(private readonly template: string) {
	}

	/**
	 * Resolve the exact ReactNodes to display for this translation.
	 * @param args the arguments to substitute for {0}, {1}, etc... in the localised string.
	 * @returns the final localised translation string for this translation.
	 */
	public resolve(...args: ReactNode[]): ReactNode {
		// Insert Args
		// First, get the args in order that they are present in the template.
		let indicesToArg : Map<number, ReactNode> = new Map();

		for (let i = 0; i < args.length; i++) {
			let index = this.template.indexOf(`{${i}}`);
			
			if (index > -1) {
				indicesToArg.set(index, args[i]);
			}
		}

		let orderedIndices = [...indicesToArg.keys()].sort();
		let split = this.template.split(/{\d+}/);
		let components : ReactNode[] = [];

		// add parts of the split with the args added between components
		for (let i = 0; i < split.length; i++) {
			// append literal, filtering out blank strings that would just become empty spans
			let literal = split[i];
			
			if (literal.length > 0) {
				components.push(literal);
			}
			
			// append arg
			if (i < orderedIndices.length) {
				let index = orderedIndices[i];
				let arg : ReactNode = indicesToArg.get(index);
				
				if (isValidElement(arg)) {
					components.push(cloneElement(arg, { key: "arg_" + i }));
				} else {
					components.push(arg);
				}
			}
		}

		return components;
	}
}