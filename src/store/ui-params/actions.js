import Incident from "@/domain/Incident";

export default {
    turnOnSpinnerOverlay(context) {
        context.commit("changeSpinnerOverlayState", true);
    },
    turnOffSpinnerOverlay(context) {
        context.commit("changeSpinnerOverlayState", false);
    },
    showNavBar(context) {
        context.commit("changeNavBarState", true);
    },
    hideNavBar(context) {
        context.commit("changeNavBarState", false);
    },
    async redirectToHomePage(context, payload) {
        const resource_id = payload.data.resource_id;
        const vueRouter = payload.vueRouter;

        await context
            .dispatch("incident/getResourceIncidents", {
                resource_id: resource_id,
                incident__status: "Started",
                exited_from_incident_no_date: "true"
            }, { root: true } )
            .then(async response => {
                if (response.data.count === 1) {
                    let incidentData = response.data.results[0].incident
                    let incident = new Incident(
                        incidentData.id,
                        incidentData.domain_name,
                        incidentData.incident_type_name,
                        incidentData.external_assistance,
                        incidentData.data_status,
                        incidentData.status,
                        incidentData.location_as_string_reference,
                        incidentData.location_point,
                        incidentData.reference,
                        incidentData.created_at,
                        incidentData.updated_at,
                        incidentData.cancelled_at,
                        incidentData.finalized_at,
                    )
                    console.log({incidentData, incident})
                    let incidentInformation = {
                        incidentId: incidentData.id,
                        resourceId: resource_id,
                        incident
                    };
                    await context.commit("incident/updateIncidentUserData", incidentInformation, { root: true });
                    if(vueRouter.history.current.name !== 'OngoingIncident') {
                        await vueRouter.push({name: "OngoingIncident"});
                    }
                } else if (response.data.count === 0) {
                    if(vueRouter.history.current.name !== 'ActiveIncidents') {
                        await vueRouter.push({name: "ActiveIncidents"});
                    }
                } else {
                    context.commit("dispatchAlert", {
                        text: "Su usuario esta vinculado a mas de un incidente, hable con un administrador",
                        color: "primary"
                    });
                }

            })
            .catch(async (error) => {
                console.error(error);
                context.commit("dispatchAlert", {
                    text: "Problemas para verificar los incidentes",
                    color: "primary"
                });
            })
            .finally(
            );
    }
};
