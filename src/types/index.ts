export type Categorie = {
	id: number;
	parent_id: number;
	name: string;
	slug: string;
	description: string;
	count: number;
};

export type Variation = {
	id: number;
	parent_id: number;
	sku: string | null;
	slug: string;
	name: string;
	description: string;
	created: string;
	modified: string;
	stock_quantity: number;
	price: number;
	image: string | null;
	attributes: {
		id: number;
		slug: string;
		option: string;
	}[];
};

export type Attribute = {
	id: number;
	slug: string;
	name: string;
	options: {
		id: number;
		slug: string;
		name: string;
	}[];
};

export type Item = {
	id: number;
	sku: string | null;
	slug: string;
	name: string;
	description: string;
	type: string;
	created: string;
	modified: string;
	language_code: string;
	stock_quantity: number | null;
	average_rating: number;
	min_price: number;
	max_price: number;
	thumbnail: {
		id: number;
		name: string;
		src: string;
	};
	images: [];
	categories: Categorie[];
	attributes: Attribute[];
	default_attributes: {
		id: number;
		slug: string;
		option: string;
	}[];
	variations: Variation[];
};
export type Items = {
	success: boolean;
	data: {
		items: Item[];
	};
};
