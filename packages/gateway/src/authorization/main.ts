import { MachineAuth } from './machine';
import { StreamAuth } from './stream';
import { UserAuth } from './user';
import { Authorization } from './types';
import { createVerify } from './verify';
import { FunctionObject, PartialApply1All } from '../common';
import { RequestContext } from '../streamsheets';

export type BaseAuth = FunctionObject & typeof MachineAuth & typeof UserAuth & typeof StreamAuth;
export const baseAuth: BaseAuth = Object.assign({}, MachineAuth, UserAuth, StreamAuth);
export const createAuthorization = (baseAuth: BaseAuth, context: RequestContext): Authorization => {
	const curriedAuth = <PartialApply1All<BaseAuth>>Object.entries(baseAuth).reduce(
		(obj, [name, func]) => ({
			...obj,
			[name]: (...args: any[]) => func(context, ...args)
		}),
		{}
	);
	return { ...curriedAuth, ...createVerify(context) };
};