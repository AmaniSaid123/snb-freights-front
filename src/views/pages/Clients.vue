<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ClientService from '@/service/ClientService';

import { useToast } from 'primevue/usetoast';

const toast = useToast();
const clients = ref(null);
const clientDialog = ref(false);
const deleteClientDialog = ref(false);
const deleteClientsDialog = ref(false);
const client = ref({});
const selectedClients = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const clientService = new ClientService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    clientService.getClients().then((data) => (clients.value = data));
});


const openNew = () => {
    client.value = {};
    submitted.value = false;
    clientDialog.value = true;
};

const hideDialog = () => {
    clientDialog.value = false;
    submitted.value = false;
};

const saveClient = () => {
    submitted.value = true;
   // if (client.value.name && client.value.name.trim() && client.value.price) {
        if (client.value.id) {
            clients.value[findIndexById(client.value.id)] = client.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
        } else {
            client.value.id = createId();
            
            client.value.name = client.value.name ? client.value.name : '';
            client.value.postName = client.value.postName ? client.value.postName : '';
            client.value.firstName = client.value.firstName ? client.value.firstName : '';
            client.value.email = client.value.email ? client.value.email : '';
            client.value.phone = client.value.phone ? client.value.phone : '';
            client.value.homeAddress = client.value.homeAddress ? client.value.homeAddress : '';
            client.value.additionalAddressDetails = client.value.additionalAddressDetails ? client.value.additionalAddressDetails : '';
            client.value.createdAt = new Date().toISOString().slice(0, 10)
            clients.value.push(client.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
        }
        clientDialog.value = false;
        client.value = {};
   // }
};

const editClient = (editClient) => {
    client.value = { ...editClient };
    console.log(client);
    clientDialog.value = true;
};

const confirmDeleteClient = (editClient) => {
    client.value = editClient;
    deleteClientDialog.value = true;
};

const deleteClient = () => {
    clients.value = clients.value.filter((val) => val.id !== client.value.id);
    deleteClientDialog.value = false;
    client.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < clients.value.length; i++) {
        if (clients.value[i].id === id) {
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
    deleteClientsDialog.value = true;
};
const deleteSelectedClients = () => {
    clients.value = clients.value.filter((val) => !selectedClients.value.includes(val));
    deleteClientsDialog.value = false;
    selectedClients.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedClients || !selectedClients.length" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="clients"
                    v-model:selection="selectedClients"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Clients</h5>
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

                    <Column field="postName" header="Post Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Post Name</span>
                            {{ slotProps.data.postName }}
                        </template>
                    </Column>
                
              
                    <Column field="firstName" header="First Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">First Name</span>
                            {{ slotProps.data.firstName }}
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

                    <Column field="homeAddress" header="Home Address" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Home Address</span>
                            {{ slotProps.data.homeAddress }}
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
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editClient(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteClient(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="clientDialog" :style="{ width: '450px' }" header="Client Details" :modal="true" class="p-fluid">
                   
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="client.name" required="true" autofocus :class="{ 'p-invalid': submitted && !client.name }" />
                        <small class="p-invalid" v-if="submitted && !client.name">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="postName">Post Name</label>
                        <InputText id="postName" v-model.trim="client.postName" required="true" autofocus :class="{ 'p-invalid': submitted && !client.postName }" />
                        <small class="p-invalid" v-if="submitted && !client.postName">Post Name is required.</small>
                    </div>


                    <div class="field">
                        <label for="firstName">First Name</label>
                        <InputText id="firstName" v-model.trim="client.firstName" required="true" autofocus :class="{ 'p-invalid': submitted && !client.firstName }" />
                        <small class="p-invalid" v-if="submitted && !client.firstName">First Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" v-model.trim="client.email" required="true" autofocus :class="{ 'p-invalid': submitted && !client.email }" />
                        <small class="p-invalid" v-if="submitted && !client.email">Email is required.</small>
                    </div>

                    <div class="field">
                        <label for="phone">Phone</label>
                        <InputText id="phone" v-model.trim="client.phone" required="true" autofocus :class="{ 'p-invalid': submitted && !client.phone }" />
                        <small class="p-invalid" v-if="submitted && !client.phone">Phone is required.</small>
                    </div>
                    

                    <div class="field">
                        <label for="homeAddress">Home Address</label>
                        <Textarea id="homeAddress" v-model="client.homeAddress" required="true" rows="3" cols="20" />
                    </div>

                

                    <div class="field">
                        <label for="additionalAddressDetails">Additional Address Details</label>
                        <Textarea id="additionalAddressDetails" v-model="client.additionalAddressDetails" required="true" rows="3" cols="20" />
                    </div>

                 
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveClient" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteClientDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="client"
                            >Are you sure you want to delete <b>{{ client.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteClientDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteClient" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteClientsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="client">Are you sure you want to delete the selected clients?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteClientsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedClients" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
