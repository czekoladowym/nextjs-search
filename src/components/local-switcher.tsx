import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function LocaleSwitcher() {
	const router = useRouter();
	const { locales, locale: activeLocale } = router;
	const otherLocales = (locales || []).filter(
		(locale) => locale !== activeLocale
	);

	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownRef]);

	return (
		<div ref={dropdownRef} className="locale-switcher">
			<button onClick={() => setIsOpen(!isOpen)}>
				Locale switcher: {activeLocale}
			</button>
			{isOpen && (
				<ul className="dropdown-menu">
					{otherLocales.map((locale) => {
						const { pathname, query, asPath } = router;
						return (
							<li key={locale}>
								<Link
									href={{ pathname, query }}
									as={asPath}
									locale={locale}
									legacyBehavior
								>
									{locale}
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
