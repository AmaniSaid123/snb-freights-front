const contextPath = import.meta.env.BASE_URL;

export default class PackageService {
    getPackages() {
        return fetch(contextPath + 'demo/data/packages.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
