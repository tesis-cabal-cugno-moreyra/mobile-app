import Vue from 'vue'
import VueRouter from 'vue-router'

import authServices from "@/services/authServices";

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "*",
    redirect: { name: "Error" }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requires_auth: true,
      is_admin: true,
      is_supervisor: true,
      is_resource: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
    // MUST NOT CONTAIN META WITH GUEST = TRUE
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      requires_auth: true,
      is_admin: true,
      is_supervisor: true,
      is_resource: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const tokenCheck = (
  to,
  next,
  isAdmin,
  isResource,
  isSupervisor,
  accessToken
) => {
  if (accessToken === null) {
    next({
      name: "Login",
      params: { nextUrl: to.fullPath }
    });
  } else if (!authServices.tokenIsExpired(accessToken)) {
    rolesCheck(to, next, isAdmin, isSupervisor, isResource);
  } else {
    //TODO: Renovar token, si no se puede mandar a vista de error! En la vista de error, decir que el token es invalido, y brindar boton a login. Vista de error toma título, texto del boton  y nombre de ruta a redireccionar ()
    this.$store.dispatch("uiParams/hideNavBar");
    next({
      name: "Login"
    });
  }
};

const rolesCheck = (to, next, isAdmin, isResource, isSupervisor) => {
  if (to.matched.some(record => record.meta.is_admin) && isAdmin) {
    next();
  } else if (
    to.matched.some(record => record.meta.is_supervisor) &&
    isSupervisor
  ) {
    next();
  } else if (to.matched.some(record => record.meta.is_resource) && isResource) {
    next();
  } else {
    next({
      name: "Error"
    });
  }
};

router.beforeEach((to, from, next) => {
  let accessToken = null;
  let isAdmin = false;
  let isSupervisor = false;
  let isResource = false;
  try {
    accessToken = authServices.getToken();
    isAdmin = authServices.isAdmin();
    isSupervisor = authServices.isSupervisor();
    isResource = authServices.isResource();
  } catch (e) {
    console.log(e);
    //TODO: Add error view.
  }
  if (to.matched.some(record => record.meta.requires_auth)) {
    tokenCheck(to, next, isAdmin, isSupervisor, isResource, accessToken);
  } else if (to.matched.some(record => record.meta.guest)) {
    if (accessToken === null) {
      next();
    } else if (authServices.tokenIsExpired(accessToken)) {
      next();
    } else {
      next({
        name: "IncidentsView"
      });
    }
  } else {
    next();
  }
});

export default router
