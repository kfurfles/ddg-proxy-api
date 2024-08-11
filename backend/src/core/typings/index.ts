export interface UseCase<Params extends Record<string, any>, Output> {
	execute: (params: Params) => Promise<Output>;
}
