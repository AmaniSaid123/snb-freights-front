<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import CountryService from '@/service/CountryService';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
const { contextPath } = useLayout();

const countries = ref(null);
const countryDialog = ref(false);
const deleteCountryDialog = ref(false);
const deleteCountriesDialog = ref(false);
const country = ref({});
const selectedCountries = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const countryService = new CountryService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    countryService.getCountries().then((data) => (countries.value = data));
});


const openNew = () => {
    country.value = {};
    submitted.value = false;
    countryDialog.value = true;
};

const hideDialog = () => {
    countryDialog.value = false;
    submitted.value = false;
};

const saveCountry = () => {
    submitted.value = true;
    if (country.value.name && country.value.name.trim() && country.value.code && country.value.code.trim()) {
        if (country.value.id) {
            countries.value[findIndexById(country.value.id)] = country.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Country Updated', life: 3000 });
        } else {
            country.value.id = createId();
            country.value.name = country.value.name ? country.value.name : '';
            country.value.code = country.value.code ? country.value.code : '';
            country.value.created_at = new Date().toISOString().slice(0, 10)
            countries.value.push(country.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Country Created', life: 3000 });
        }
        countryDialog.value = false;
        country.value = {};
    }
};

const editCountry = (editCountry) => {
    country.value = { ...editCountry };
    console.log(country);
    countryDialog.value = true;
};

const confirmDeleteCountries = (editCountry) => {
    country.value = editCountry;
    deleteCountryDialog.value = true;
};

const deleteCountry = () => {
    countries.value = countries.value.filter((val) => val.id !== country.value.id);
    deleteCountryDialog.value = false;
    country.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Country Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].id === id) {
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
    deleteCountriesDialog.value = true;
};
const deleteSelectedCountries = () => {
    countries.value = countries.value.filter((val) => !selectedCountries.value.includes(val));
    deleteCountriesDialog.value = false;
    selectedCountries.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Countries Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                                @click="confirmDeleteSelected"
                                :disabled="!selectedCountries || !selectedCountries.length" />
                        </div>
                    </template>

                </Toolbar>

                <DataTable ref="dt" :value="countries" v-model:selection="selectedCountries" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} countries"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Countries</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column field="id" header="Id" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>

                    <Column field="name" header="Name" :sortable="true" :style="{ width: '200px' }"
                        headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                            <img src="/demo/images/flag/flag_placeholder.png" :alt="Snb_freight"
                                :class="'flag flag-' + slotProps.data.code" width="30"/>
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                slotProps.data.name
                            }}</span>
                        </template>
                    </Column>

                    <Column field="code" header="Code" :sortable="true" headerStyle="width:%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>

                    <Column field="created_at" header="Created At" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Created At</span>
                            {{ slotProps.data.created_at }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editCountry(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteCountries(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="countryDialog" :style="{ width: '450px' }" header="Country Details"
                    :modal="true" class="p-fluid">
                    <img :src="contextPath + 'demo/images/country/' + country.image" :alt="country.image"
                        v-if="country.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />

                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="country.name" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !country.name }" />
                        <small class="p-invalid" v-if="submitted && !country.name">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="code">Code</label>
                        <InputText id="code" v-model.trim="country.code" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !country.code }" />
                        <small class="p-invalid" v-if="submitted && !country.code">Code is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCountry" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCountryDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="country">Are you sure you want to delete <b>{{ country.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deleteCountryDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCountry" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCountriesDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="country">Are you sure you want to delete the selected countries?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deleteCountriesDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedCountries" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
