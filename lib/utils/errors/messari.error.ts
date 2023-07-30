export class MessariError extends Error {
	public readonly message: string;
	public readonly code: number;
	public readonly timestamp: string;

	constructor(message: string, code: number = 500, timestamp: string) {
		super(message);

		this.message = message;
		this.code = code;
		this.timestamp = timestamp;

		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}
