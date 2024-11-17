'use client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useGetItemsQuery, useGetProductsQuery } from '@/store/api';
import Image from 'next/image';
import { SearchIcon } from 'lucide-react';
import { Items } from '@/types';
import LocaleSwitcher from './local-switcher';
import translations from '@/translations/index.json';

export default function Search() {
	const router = useRouter();
	const { locale: activeLocale } = router;
	const message = translations[activeLocale as keyof typeof translations];

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
	const [initialData, setInitialData] = useState<Items | null>(null);

	const { data: itemsList, isLoading } = useGetItemsQuery(
		{
			term: searchTerm,
			locale: activeLocale || 'en',
		},
		{ skip: searchTerm.length < 3 }
	);
	const { data: initialProducts } = useGetProductsQuery({
		page: 1,
		per_page: 15,
		locale: activeLocale || 'en',
	});

	useEffect(() => {
		if (initialProducts) {
			setInitialData(initialProducts);
		}
	}, [initialData, initialProducts]);

	const handleSearch = useDebouncedCallback((term: string) => {
		setSearchTerm(term);
	}, 1500);

	const handleSearchClick = () => {
		if (searchTerm.length >= 3) {
			router.push(`/search/${searchTerm}`);
		}
	};

	return (
		<div className="search-field">
			<LocaleSwitcher />
			<div className="search-input">
				<input
					placeholder={message.search}
					onChange={(e) => {
						handleSearch(e.target.value);
					}}
					onFocus={() => setIsInputFocused(true)}
					onBlur={() => setIsInputFocused(false)}
				/>
				<button
					onClick={handleSearchClick}
					disabled={searchTerm.length < 3}
					className="button"
				>
					<SearchIcon color="#fff" />
				</button>
			</div>
			{isInputFocused && (
				<div className="dropdown">
					{isLoading ? (
						<h1>Loading...</h1>
					) : itemsList?.success && itemsList?.data.items ? (
						itemsList.data.items.map((item) => (
							<div key={item.id} className="dropdown-item">
								<Image
									src={item.thumbnail.src}
									alt={item.thumbnail.name}
									height={64}
									width={64}
								/>
								<div className="item-info">
									<h2 className="item-name">{item.name}</h2>
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
							</div>
						))
					) : (
						initialData &&
						initialData.data.items.map((item) => (
							<div key={item.id} className="dropdown-item">
								<Image
									src={item.thumbnail.src}
									alt={item.thumbnail.name}
									height={64}
									width={64}
								/>
								<div className="item-info">
									<h2 className="item-name">{item.name}</h2>
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
							</div>
						))
					)}
					{itemsList?.success &&
						!itemsList?.data.items.length &&
						!isLoading && (
							<h2 className="no-results-screen">{message.noResults}</h2>
						)}
				</div>
			)}
		</div>
	);
}
