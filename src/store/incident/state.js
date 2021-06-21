export default {
    incidentUserData: {
        resourceId: localStorage.getItem("resourceId"),
        incidentId: localStorage.getItem("incidentId"),
        incident: undefined,
    },
    showResourceToContainResource: {
        visible: false,
        resourceToContainResource: null,
        idContainerResource: null
    }

};
