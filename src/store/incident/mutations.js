export default {
    updateIncidentUserData(state, user) {
        state.incidentUserData.resourceId = user.resourceId;
        state.incidentUserData.incidentId = user.incidentId
    },
    changeVisibilityResourceToContainResource(state) {
        state.showResourceToContainResource.visible = true;
    },
    closeResourceToContainResource(state) {
        state.showResourceToContainResource.visible = false;


    },
};
