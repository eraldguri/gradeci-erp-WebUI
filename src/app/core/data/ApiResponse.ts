export interface ApiResponse<TData> {
    data: TData;
    messages: string[];
    isSuccessful: boolean;
}