import storageServices from "@/services/storageServices";

export default {
  updateAccessToken(state, newToken) {
    storageServices.setAccessToken(newToken);
    localStorage.setItem("access-token", newToken);
    state.accessToken = newToken;
  },
  updateRefreshToken(state, newToken) {
    storageServices.setRefreshToken(newToken)
    localStorage.setItem("refresh-token", newToken);
    state.refreshToken = newToken;
  },
  removeToken(state) {
    storageServices.removeAccessToken();
    localStorage.removeItem("access-token");
    state.accessToken = null;
    storageServices.removeRefreshToken();
    localStorage.removeItem("refresh-token");
    state.refreshToken = null;
  },
  updateUser(state, user) {
    state.user.username = user.username;
    state.user.resourceId = user.resourceId
    state.user.id = user.id;
    state.user.email = user.email;
    state.user.firstName = user.firstName;
    state.user.lastName = user.lastName;
    state.user.roles = user.roles;
    localStorage.setItem("user", JSON.stringify(state.user));
  },
  removeUser(state) {
    localStorage.removeItem("user");
    state.user.resourceId= null;
    state.user.username = null;
    state.user.id = null;
    state.user.email = null;
    state.user.firstName = null;
    state.user.lastName = null;
    state.user.roles = null;
  }
};
