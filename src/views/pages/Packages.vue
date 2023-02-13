<script setup>
import PackageService from '@/service/PackageService';
import { ref, onBeforeMount } from 'vue';


const packages = ref(null);
const expandedRows = ref([]);

const packageService = new PackageService();

onBeforeMount(() => {
    packageService.getPackages().then((data) => (packages.value = data));
    initFilters1();
});

const initFilters1 = () => {};


const expandAll = () => {
    expandedRows.value = packages.value.filter((p) => p.id);
};
const collapseAll = () => {
    expandedRows.value = null;
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Packages</h5>
                <DataTable :value="packages" v-model:expandedRows="expandedRows" dataKey="id" responsiveLayout="scroll">
                    <template #header>
                        <div>
                            <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2 mb-2" />
                            <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" class="mb-2" />
                        </div>
                    </template>
                    <Column :expander="true" headerStyle="min-width: 3rem" />

                    <Column field="id" header="Id" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.id }}
                        </template>
                    </Column>

                    <Column field="code" header="Code" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="estimatedWeight" header="Estimated Weight" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.estimatedWeight }}
                        </template>
                    </Column>
               
                    <Column field="typePackage" header="Type Package" :sortable="true">
                        <template #body="slotProps">
                            {{ (slotProps.data.typePackage) }}
                        </template>
                    </Column>
                  
                    <Column field="description" header="Description" :sortable="true">
                        <template #body="slotProps">
                            {{ (slotProps.data.description) }}
                        </template>
                    </Column>

                    <Column field="estimatedValuePackage" header="Estimated Value Package" :sortable="true">
                        <template #body="slotProps">
                            {{ (slotProps.data.estimatedValuePackage) }}
                        </template>
                    </Column>
                    
                    <Column field="inventoryStatus" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <h5>Shippers for {{ slotProps.data.code }} </h5>
                            <DataTable :value="slotProps.data.clients" responsiveLayout="scroll">
                                <Column field="id" header="Id" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.id }}
                                    </template>
                                </Column>

                                <Column field="name" header="Name" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.name }}
                                    </template>
                                </Column>

                                <Column field="postName" header="Post Name" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.postName }}
                                    </template>
                                </Column>

                                <Column field="firstName" header="First Name" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.firstName) }}
                                    </template>
                                </Column>

                                <Column field="email" header="Email" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.email) }}
                                    </template>
                                </Column>


                                <Column field="phone" header="Phone" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.phone) }}
                                    </template>
                                </Column>


                                <Column field="homeAddress" header="Home Address" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.homeAddress) }}
                                    </template>
                                </Column>

                                <Column field="additionalAddressDetailsfirstName" header="Additional Address Details" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.additionalAddressDetails) }}
                                    </template>
                                </Column>

                                <Column field="createdAt" header="Created At" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.createdAt) }}
                                    </template>
                                </Column>
                                
                                <Column headerStyle="width:4rem">
                                    <template #body>
                                        <Button icon="pi pi-search" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                        <div class="p-3">
                            <h5>Destinations for {{ slotProps.data.code }} </h5>
                            <DataTable :value="slotProps.data.clients" responsiveLayout="scroll">
                                <Column field="id" header="Id" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.id }}
                                    </template>
                                </Column>

                                <Column field="name" header="Name" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.name }}
                                    </template>
                                </Column>

                                <Column field="postName" header="Post Name" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.postName }}
                                    </template>
                                </Column>

                                <Column field="firstName" header="First Name" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.firstName) }}
                                    </template>
                                </Column>

                                <Column field="email" header="Email" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.email) }}
                                    </template>
                                </Column>


                                <Column field="phone" header="Phone" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.phone) }}
                                    </template>
                                </Column>


                                <Column field="homeAddress" header="Home Address" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.homeAddress) }}
                                    </template>
                                </Column>

                                <Column field="additionalAddressDetailsfirstName" header="Additional Address Details" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.additionalAddressDetails) }}
                                    </template>
                                </Column>

                                <Column field="createdAt" header="Created At" :sortable="true">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.createdAt) }}
                                    </template>
                                </Column>
                                
                                <Column headerStyle="width:4rem">
                                    <template #body>
                                        <Button icon="pi pi-search" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                    
                </DataTable>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
