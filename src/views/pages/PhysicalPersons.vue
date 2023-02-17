<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import PhysicalPersonService from '@/service/PhysicalPersonService';


import { useToast } from 'primevue/usetoast';

const toast = useToast();
const physicalPersons = ref(null);
const physicalPersonDialog = ref(false);
const deletePhysicalPersonDialog = ref(false);
const deletePhysicalPersonsDialog = ref(false);
const physicalPerson = ref({});
const selectedPhysicalPersons = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const physicalPersonService = new PhysicalPersonService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    physicalPersonService.getPhysicalPersons().then((data) => (physicalPersons.value = data));
});


const openNew = () => {
    physicalPerson.value = {};
    submitted.value = false;
    physicalPersonDialog.value = true;
};

const hideDialog = () => {
    physicalPersonDialog.value = false;
    submitted.value = false;
};

const savePhysicalPerson = () => {
    submitted.value = true;
   // if (physicalPerson.value.name && physicalPerson.value.name.trim() && physicalPerson.value.price) {
        if (physicalPerson.value.id) {
            physicalPersons.value[findIndexById(physicalPerson.value.id)] = physicalPerson.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Physical Person Updated', life: 3000 });
        } else {
            physicalPerson.value.id = createId();
            
            physicalPerson.value.name = physicalPerson.value.name ? physicalPerson.value.name : '';
            physicalPerson.value.postName = physicalPerson.value.postName ? physicalPerson.value.postName : '';
            physicalPerson.value.firstName = physicalPerson.value.firstName ? physicalPerson.value.firstName : '';
            physicalPerson.value.email = physicalPerson.value.email ? physicalPerson.value.email : '';
            physicalPerson.value.phone = physicalPerson.value.phone ? physicalPerson.value.phone : '';
            physicalPerson.value.additionalAddressDetails = physicalPerson.value.additionalAddressDetails ? physicalPerson.value.additionalAddressDetails : '';
            physicalPerson.value.createdAt = new Date().toISOString().slice(0, 10)
            physicalPersons.value.push(physicalPerson.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Physical Person Created', life: 3000 });
        }
        physicalPersonDialog.value = false;
        physicalPerson.value = {};
   // }
};

const editPhysicalPerson = (editPhysicalPerson) => {
    physicalPerson.value = { ...editPhysicalPerson };
    console.log(physicalPerson);
    physicalPersonDialog.value = true;
};

const confirmDeletePhysicalPerson = (editPhysicalPerson) => {
    physicalPerson.value = editPhysicalPerson;
    deletePhysicalPersonDialog.value = true;
};

const deletePhysicalPerson = () => {
    physicalPersons.value = physicalPersons.value.filter((val) => val.id !== physicalPerson.value.id);
    deletePhysicalPersonDialog.value = false;
    physicalPerson.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Physical Person Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < physicalPersons.value.length; i++) {
        if (physicalPersons.value[i].id === id) {
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
    deletePhysicalPersonsDialog.value = true;
};
const deleteSelectedPhysicalPersons = () => {
    physicalPersons.value = physicalPersons.value.filter((val) => !selectedPhysicalPersons.value.includes(val));
    deletePhysicalPersonsDialog.value = false;
    selectedPhysicalPersons.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'PhysicalPersons Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedPhysicalPersons || !selectedPhysicalPersons.length" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="physicalPersons"
                    v-model:selection="selectedPhysicalPersons"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} physicalPersons"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Physical Persons</h5>
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

                    <Column field="address" header="Address" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Address</span>
                            {{ slotProps.data.address }}
                        </template>
                    </Column>

                    <Column field="postalcode" header="Postal Code" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Postal Code</span>
                            {{ slotProps.data.postalcode }}
                        </template>
                    </Column>


                    <Column field="city" header="City" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">City</span>
                            {{ slotProps.data.city }}
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
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editPhysicalPerson(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeletePhysicalPerson(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="physicalPersonDialog" :style="{ width: '450px' }" header="Physical Person Details" :modal="true" class="p-fluid">
                   
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="physicalPerson.name" required="true" autofocus :class="{ 'p-invalid': submitted && !physicalPerson.name }" />
                        <small class="p-invalid" v-if="submitted && !physicalPerson.name">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="postName">Post Name</label>
                        <InputText id="postName" v-model.trim="physicalPerson.postName" required="true" autofocus :class="{ 'p-invalid': submitted && !physicalPerson.postName }" />
                        <small class="p-invalid" v-if="submitted && !physicalPerson.postName">Post Name is required.</small>
                    </div>


                    <div class="field">
                        <label for="firstName">First Name</label>
                        <InputText id="firstName" v-model.trim="physicalPerson.firstName" required="true" autofocus :class="{ 'p-invalid': submitted && !physicalPerson.firstName }" />
                        <small class="p-invalid" v-if="submitted && !physicalPerson.firstName">First Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" v-model.trim="physicalPerson.email" required="true" autofocus :class="{ 'p-invalid': submitted && !physicalPerson.email }" />
                        <small class="p-invalid" v-if="submitted && !physicalPerson.email">Email is required.</small>
                    </div>

                    <div class="field">
                        <label for="phone">Phone</label>
                        <InputText id="phone" v-model.trim="physicalPerson.phone" required="true" autofocus :class="{ 'p-invalid': submitted && !physicalPerson.phone }" />
                        <small class="p-invalid" v-if="submitted && !physicalPerson.phone">Phone is required.</small>
                    </div>
                    

                 
                    <div class="field">
                        <label for="additionalAddressDetails">Additional Address Details</label>
                        <Textarea id="additionalAddressDetails" v-model="physicalPerson.additionalAddressDetails" required="true" rows="3" cols="20" />
                    </div>

                 
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePhysicalPerson" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletePhysicalPersonDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="physicalPerson"
                            >Are you sure you want to delete <b>{{ physicalPerson.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePhysicalPersonDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePhysicalPerson" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletePhysicalPersonsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="physicalPerson">Are you sure you want to delete the selected physical Persons?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePhysicalPersonsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPhysicalPersons" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
