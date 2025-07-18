const API_BASE_URL = 'https://api.open5e.com/v1/';

export async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}/?document__slug=5esrd`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`Falha ao buscar ${endpoint}:`, error);
        return [];
    }
}