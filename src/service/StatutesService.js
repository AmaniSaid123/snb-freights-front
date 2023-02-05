const contextPath = import.meta.env.BASE_URL;

export default class StatutesService {
    getStatus() {
        return fetch(contextPath + 'demo/data/status.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
