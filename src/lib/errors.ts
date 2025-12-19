class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public code: string = "Error",
        public details?: unknown,
    ){
        super(message)
    }
}