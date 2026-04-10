export interface ApiCollectionResponse<T> {
  data: T[];
  meta: {
    total: number;
  };
}

export interface ApiItemResponse<T> {
  data: T;
  message?: string;
}

export interface ApiMessageResponse {
  message: string;
}
