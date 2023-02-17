const contextPath = import.meta.env.BASE_URL;

export default class CompanyService {
    getCompanies() {
        return fetch(contextPath + 'demo/data/companies.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}