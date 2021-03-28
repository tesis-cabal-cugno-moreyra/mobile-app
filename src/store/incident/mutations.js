export default {
    updateIncidentUserData(state, user) {
        state.incidentUserData.resourceId = user.resourceId;
        state.incidentUserData.incidentId = user.incidentId;
    },
    changeVisibilityResourceToContainResource(state, payload) {
        state.showResourceToContainResource.visible = true;

        state.showResourceToContainResource.resourceToContainResource = payload.resourceToContainResource;

        state.showResourceToContainResource.idContainerResource = payload.idContainerResource;

    },
    closeResourceToContainResource(state) {
        state.showResourceToContainResource.visible = false;


    },
};
