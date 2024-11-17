import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Items } from '@/types';

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	endpoints: (builder) => ({
		getItems: builder.query<Items, { term: string; locale: string }>({
			query: ({ term, locale }) => `items?search=${term}&lang=${locale}`,
		}),
		getProducts: builder.query<
			Items,
			{
				page: number;
				per_page: number;
				locale: string;
			}
		>({
			query: ({ page, per_page, locale }) =>
				`products?page=${page}&per_page=${per_page}&lang=${locale}`,
		}),
	}),
});

export const { useGetItemsQuery, useGetProductsQuery } = api;
