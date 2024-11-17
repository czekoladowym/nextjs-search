import { NextApiRequest, NextApiResponse } from 'next';
import { Items } from '@/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { page, per_page, activeLocale } = req.query;

	const lang = activeLocale || 'en';

	const url = process.env.BASE_URL;

	try {
		const response = await fetch(
			`${url}/products?page=${page}&per_page=${per_page}&lang=${lang}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}
		const data: Items = await response.json();
		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ message: 'Error fetching data' });
	}
}
