import { NextApiRequest, NextApiResponse } from 'next';
import { Items } from '@/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { search, activeLocale } = req.query;

	if (!search || typeof search !== 'string' || search.length < 3) {
		return res.status(400).json({
			message: 'Invalid search query. Must be at least 3 characters.',
		});
	}

	const lang = activeLocale || 'en';

	const url = process.env.BASE_URL;

	try {
		const response = await fetch(
			`${url}/products?search=${search}&lang=${lang}`
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch products: ${response.statusText}`);
		}

		const data: Items = await response.json();
		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ message: 'Error fetching data' });
	}
}
