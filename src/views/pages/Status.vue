<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import StatusService from '@/service/StatusService';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
const { contextPath } = useLayout();

const status = ref(null);
const statutesDialog = ref(false);
const deleteStatutesDDialog = ref(false);
const deleteStatusDialog = ref(false);
const statutes = ref({});
const selectedStatus = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const statusService = new StatusService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    statusService.getStatus().then((data) => (status.value = data));
});


const openNew = () => {
    statutes.value = {};
    submitted.value = false;
    statutesDialog.value = true;
};

const hideDialog = () => {
    statutesDialog.value = false;
    submitted.value = false;
};

const saveStatutes = () => {
    submitted.value = true;
    if (statutes.value.code && statutes.value.code.trim() && statutes.value.label && statutes.value.label.trim()) {
        if (statutes.value.id) {
            status.value[findIndexById(statutes.value.id)] = statutes.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Statutes Updated', life: 3000 });
        } else {
            statutes.value.id = createId();
            statutes.value.code = statutes.value.code ? statutes.value.code : '';
            statutes.value.label = statutes.value.label ? statutes.value.label : '';
            statutes.value.created_at = new Date().toISOString().slice(0, 10)
            status.value.push(statutes.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Statutes Created', life: 3000 });
        }
        statutesDialog.value = false;
        statutes.value = {};
    }
};

const editStatutes = (editStatutes) => {
    statutes.value = { ...editStatutes };
    console.log(statutes);
    statutesDialog.value = true;
};

const confirmDeleteStatus = (editStatutes) => {
    statutes.value = editStatutes;
    deleteStatutesDDialog.value = true;
};

const deleteStatutes = () => {
    status.value = status.value.filter((val) => val.id !== statutes.value.id);
    deleteStatutesDDialog.value = false;
    statutes.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Statutes Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < status.value.length; i++) {
        if (status.value[i].id === id) {
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
    deleteStatusDialog.value = true;
};
const deleteSelectedStatus = () => {
    status.value = status.value.filter((val) => !selectedStatus.value.includes(val));
    deleteStatusDialog.value = false;
    selectedStatus.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Status Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedStatus || !selectedStatus.length" />
                        </div>
                    </template>

                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="status"
                    v-model:selection="selectedStatus"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} status"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Status</h5>
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

                    <Column field="label" header="Label" :sortable="true" headerStyle="width:%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Label</span>
                            {{ slotProps.data.label }}
                        </template>
                    </Column>
             
              
                    <Column field="code" header="Code" :sortable="true" headerStyle="width:%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>

                     <Column field="created_at" header="Created At" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Created At</span>
                            {{ slotProps.data.created_at }}
                        </template>
                    </Column> 

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editStatutes(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteStatus(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="statutesDialog" :style="{ width: '450px' }" header="Statutes Details" :modal="true" class="p-fluid">
                    <img :src="contextPath + 'demo/images/statutes/' + statutes.image" :alt="statutes.image" v-if="statutes.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                   
                    <div class="field">
                        <label for="label">Label</label>
                        <InputText id="label" v-model.trim="statutes.label" required="true" autofocus :class="{ 'p-invalid': submitted && !statutes.label }" />
                        <small class="p-invalid" v-if="submitted && !statutes.label">Label is required.</small>
                    </div>

                    <div class="field">
                        <label for="code">Code</label>
                        <InputText id="code" v-model.trim="statutes.code" required="true" autofocus :class="{ 'p-invalid': submitted && !statutes.code }" />
                        <small class="p-invalid" v-if="submitted && !statutes.code">Code is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveStatutes" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteStatutesDDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="statutes"
                            >Are you sure you want to delete <b>{{ statutes.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteStatutesDDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteStatutes" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteStatusDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="statutes">Are you sure you want to delete the selected status?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteStatusDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedStatus" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
