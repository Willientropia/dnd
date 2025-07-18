const API_BASE_URL = 'https://api.open5e.com/v1/';

export async function fetchData(endpoint, params = {}) {
    try {
        const query = new URLSearchParams(params).toString();
        let response = await fetch(`${API_BASE_URL}${endpoint}?${query}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Falha ao buscar ${endpoint}:`, error);
        return [];
    }
}