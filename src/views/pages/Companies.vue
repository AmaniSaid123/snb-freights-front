<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import CompanyService from '@/service/CompanyService';

import { useToast } from 'primevue/usetoast';

const toast = useToast();
const companies = ref(null);
const companyDialog = ref(false);
const deleteCompanyDialog = ref(false);
const deleteCompaniesDialog = ref(false);
const company = ref({});
const selectedCompanies = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const companyService = new CompanyService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    companyService.getCompanies().then((data) => (companies.value = data));
});


const openNew = () => {
    company.value = {};
    submitted.value = false;
    companyDialog.value = true;
};

const hideDialog = () => {
    companyDialog.value = false;
    submitted.value = false;
};

const saveCompany = () => {
    submitted.value = true;
   // if (company.value.name && company.value.name.trim() && company.value.price) {
        if (company.value.id) {
            companies.value[findIndexById(company.value.id)] = company.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
        } else {
            company.value.id = createId();
            
            company.value.name = company.value.name ? company.value.name : '';
            company.value.postName = company.value.postName ? company.value.postName : '';
            company.value.firstName = company.value.firstName ? company.value.firstName : '';
            company.value.email = company.value.email ? company.value.email : '';
            company.value.phone = company.value.phone ? company.value.phone : '';
            company.value.homeAddress = company.value.homeAddress ? company.value.homeAddress : '';
            company.value.additionalAddressDetails = company.value.additionalAddressDetails ? company.value.additionalAddressDetails : '';
            company.value.createdAt = new Date().toISOString().slice(0, 10)
            companies.value.push(company.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
        }
        companyDialog.value = false;
        company.value = {};
   // }
};

const editCompany = (editCompany) => {
    company.value = { ...editCompany };
    console.log(company);
    companyDialog.value = true;
};

const confirmDeleteCompany = (editCompany) => {
    company.value = editCompany;
    deleteCompanyDialog.value = true;
};

const deleteCompany = () => {
    companies.value = companies.value.filter((val) => val.id !== company.value.id);
    deleteCompanyDialog.value = false;
    company.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Company Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < companies.value.length; i++) {
        if (companies.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const confirmDeleteSelected = () => {
    deleteCompaniesDialog.value = true;
};
const deleteSelectedCompanies = () => {
    companies.value = companies.value.filter((val) => !selectedCompanies.value.includes(val));
    deleteCompaniesDialog.value = false;
    selectedCompanies.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Companies Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedCompanies || !selectedCompanies.length" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="companies"
                    v-model:selection="selectedCompanies"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Companies</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>


                    <Column field="email" header="Email" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>

                    <Column field="phone" header="Phone" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Phone</span>
                            {{ slotProps.data.phone }}
                        </template>
                    </Column>

                    <Column field="address" header="Address" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Address</span>
                            {{ slotProps.data.address }}
                        </template>
                    </Column>


                    <Column field="postalcode" header="Postal Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Postal Code</span>
                            {{ slotProps.data.postalcode }}
                        </template>
                    </Column>
                    
                    <Column field="city" header="City" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">City</span>
                            {{ slotProps.data.city }}
                        </template>
                    </Column>


                    <Column field="additionalAddressDetails" header="Additional Address Details" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Additional Address Details</span>
                            {{ slotProps.data.additionalAddressDetails }}
                        </template>
                    </Column>

                    <Column field="createdAt" header="Created At" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Created At</span>
                            {{ slotProps.data.createdAt }}
                        </template>
                    </Column>
                    
                   
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCompany(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteCompany(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="companyDialog" :style="{ width: '450px' }" header="Company Details" :modal="true" class="p-fluid">
                   
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="company.name" required="true" autofocus :class="{ 'p-invalid': submitted && !company.name }" />
                        <small class="p-invalid" v-if="submitted && !company.name">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="postName">Post Name</label>
                        <InputText id="postName" v-model.trim="company.postName" required="true" autofocus :class="{ 'p-invalid': submitted && !company.postName }" />
                        <small class="p-invalid" v-if="submitted && !company.postName">Post Name is required.</small>
                    </div>


                    <div class="field">
                        <label for="firstName">First Name</label>
                        <InputText id="firstName" v-model.trim="company.firstName" required="true" autofocus :class="{ 'p-invalid': submitted && !company.firstName }" />
                        <small class="p-invalid" v-if="submitted && !company.firstName">First Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" v-model.trim="company.email" required="true" autofocus :class="{ 'p-invalid': submitted && !company.email }" />
                        <small class="p-invalid" v-if="submitted && !company.email">Email is required.</small>
                    </div>

                    <div class="field">
                        <label for="phone">Phone</label>
                        <InputText id="phone" v-model.trim="company.phone" required="true" autofocus :class="{ 'p-invalid': submitted && !company.phone }" />
                        <small class="p-invalid" v-if="submitted && !company.phone">Phone is required.</small>
                    </div>
                    

                    <div class="field">
                        <label for="homeAddress">Home Address</label>
                        <Textarea id="homeAddress" v-model="company.homeAddress" required="true" rows="3" cols="20" />
                    </div>

                

                    <div class="field">
                        <label for="additionalAddressDetails">Additional Address Details</label>
                        <Textarea id="additionalAddressDetails" v-model="company.additionalAddressDetails" required="true" rows="3" cols="20" />
                    </div>

                 
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCompany" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCompanyDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="company"
                            >Are you sure you want to delete <b>{{ company.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCompanyDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCompany" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCompaniesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="company">Are you sure you want to delete the selected companies?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCompaniesDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedCompanies" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
