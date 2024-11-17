import { GetServerSideProps } from 'next';
import { Items } from '@/types';
import Image from 'next/image';
import { HouseIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import translations from '@/translations/index.json';

type SearchResultsProps = {
	query: string;
	itemsList: Items;
};

export default function SearchResults({
	query,
	itemsList,
}: SearchResultsProps) {
	const router = useRouter();
	const { locale: activeLocale } = router;
	const message = translations[activeLocale as keyof typeof translations];
	return (
		<div className="search-results">
			<div className="header">
				<h1>
					{message.searchResultsFor}: {query}
				</h1>
				<button className="button small" onClick={() => router.push('/')}>
					<span>{message.goBack}</span>
					<HouseIcon color="#fff" size={18} />
				</button>
			</div>

			<div className="items-container">
				{itemsList?.data.items.map((item) => (
					<div key={item.id} className="item">
						<div className="card-image">
							<Image
								src={item.thumbnail.src}
								alt={item.thumbnail.name}
								height={200}
								width={200}
							/>
						</div>

						<h2>{item.name}</h2>
						<span className="price-range">
							{item.min_price !== item.max_price ? (
								<>
									<p>{item.min_price} zl</p>
									<p className="old-price">{item.max_price} zl</p>
								</>
							) : (
								<p>{item.min_price} zl</p>
							)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { query } = context.params as { query: string };

	if (!query || query.trim().length < 3) {
		return { notFound: true };
	}

	const url = process.env.BASE_URL;

	try {
		const response = await fetch(`${url}/products?search=${query}`);

		if (!response.ok) {
			console.error(`API returned error: ${response.status}`);
			return { notFound: true };
		}

		const itemsList: Items = await response.json();

		if (!itemsList.success || !itemsList.data?.items) {
			console.error('Invalid API response:', itemsList);
			return { notFound: true };
		}

		return {
			props: {
				query,
				itemsList,
			},
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return { notFound: true };
	}
};
