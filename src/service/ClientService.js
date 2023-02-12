const contextPath = import.meta.env.BASE_URL;
export default class ClientService {
    getClients() {
        return fetch(contextPath + 'demo/data/clients.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
