const contextPath = import.meta.env.BASE_URL;

export default class StatutService {
    getStatutes() {
        return fetch(contextPath + 'demo/data/statutes.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}