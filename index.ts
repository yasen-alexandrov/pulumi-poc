import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import {getStack, getProject} from "@pulumi/pulumi";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("rgPulumiStateInAzure",{location: "West Europe"});

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount(`sa9${getStack()}`, {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    // tags : { "environment": `env-${getStack()}`},
    kind: storage.Kind.StorageV2,
});

// Export the primary key of the Storage Account
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
export const primaryStorageKey = storageAccountKeys.keys[0].value;
