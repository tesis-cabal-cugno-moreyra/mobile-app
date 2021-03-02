export default {
    updateIncidentUserData(state, user) {
        state.incidentUserData.resourceId = user.resourceId;
        state.incidentUserData.incidentId = user.incidentId

    },
};
