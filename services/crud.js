import axios from 'axios';

const API_ROOT = process.env.JSON_SERVER_URL || 'http://localhost:3001';
const API = `${API_ROOT}/games`;
const CATEGORIES_API = `${API_ROOT}/categories`;
const authConfig = (authorization) => authorization
	? { headers: { Authorization: authorization } }
	: {};

export async function getAllGames(search = '', order = 'asc', page = 1, limit = 3, authorization) {
	const params = {
		_sort: 'title',
		_order: order,
		_page: page,
		_limit: limit,
	};
	if (search.trim()) params.q = search.trim();

	const response = await axios.get(API, {
		params,
		...authConfig(authorization),
	});
	return {
		games: response.data,
		total: Number(response.headers['x-total-count'] || response.data.length),
	};
}

export async function getAllCategories(authorization) {
	const response = await axios.get(CATEGORIES_API, authConfig(authorization));
	return response.data;
}

export async function getGameById(id, authorization) {
	const response = await axios.get(`${API}/${id}`, authConfig(authorization));
	return response.data;
}

export async function createGame(game, authorization) {
	const response = await axios.post(API, game, authConfig(authorization));
	return response.data;
}

export async function updateGame(id, game, authorization) {
	const response = await axios.patch(`${API}/${id}`, game, authConfig(authorization));
	return response.data;
}

export async function deleteGame(id, authorization) {
	await axios.delete(`${API}/${id}`, authConfig(authorization));
	return { ok: true };
}
