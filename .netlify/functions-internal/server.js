var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// server.js
var server_exports = {};
__export(server_exports, {
  handler: () => handler
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// server.js
var import_netlify = require("@remix-run/netlify");

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// app/entry.server.jsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = require("react-dom/server");
var import_react = require("@remix-run/react");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:/Users/ham/hamish/Strength-Tracker/app/root.jsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader
});
var import_react6 = require("@remix-run/react");

// app/utils/session.server.ts
var import_bcrypt = __toESM(require("bcrypt"));

// app/utils/db.server.ts
var import_client = require("@prisma/client");
var db;
if (false) {
  db = new import_client.PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new import_client.PrismaClient();
    global.__db.$connect();
  }
  db = global.__db;
}

// app/utils/session.server.ts
var import_node = require("@remix-run/node");
async function login({ email, password }) {
  const user = await db.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    return null;
  }
  const isCorrectPassword = await import_bcrypt.default.compare(password, user.passwordHash);
  if (!isCorrectPassword)
    return null;
  return user;
}
async function changePassword({ email, oldPassword, newPassword }) {
  const user = await db.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    return null;
  }
  const isCorrectPassword = await import_bcrypt.default.compare(oldPassword, user.passwordHash);
  const passwordHash = await import_bcrypt.default.hash(newPassword, 10);
  if (!isCorrectPassword) {
    console.log("wrong password");
    return null;
  }
  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash
    }
  });
  console.log("password true`");
  return true;
}
async function register({ email, password, name }) {
  const passwordHash = await import_bcrypt.default.hash(password, 10);
  return db.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });
}
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No session secret");
}
var storage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "remixblog_session",
    secure: false,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true
  }
});
async function createUserSession(userId, redirectTo) {
  console.log("redirect");
  const session = await storage.getSession();
  session.set("userId", userId);
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUser(request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    });
    return user;
  } catch (error) {
    return null;
  }
}
async function logout(request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return (0, import_node.redirect)("/auth/logout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

// app/styles/app.css
var app_default = "/build/_assets/app-FH3LOHJQ.css";

// app/styles/mobile.css
var mobile_default = "/build/_assets/mobile-MMIDJDXZ.css";

// app/components/ui/MobileNav.jsx
var import_react2 = require("react");
var import_react3 = require("@remix-run/react");
function MobileNav({ children, user, props }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "mobile-nav-menu__wrapper "
  }, children, /* @__PURE__ */ React.createElement("nav", {
    className: "navigation mobile-navigation"
  }, /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "/dashboard",
    className: "",
    onClick: () => props.onClick()
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-browsers"
  }), /* @__PURE__ */ React.createElement("span", null, "Dashboard")), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "/dashboard/prs",
    onClick: () => props.onClick()
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-check-square"
  }), /* @__PURE__ */ React.createElement("span", null, "Personal Records")), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "dashboard/workouts",
    onClick: () => props.onClick()
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-swap"
  }), /* @__PURE__ */ React.createElement("span", null, "Workouts")), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "/dashboard/exercises",
    onClick: () => props.onClick()
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-file-text"
  }), /* @__PURE__ */ React.createElement("span", null, "Exercises")), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "/dashboard/goals",
    onClick: () => props.onClick()
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-file-text"
  }), /* @__PURE__ */ React.createElement("span", null, "Goals")), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: `/dashboard/${user.id}/profile`,
    onClick: () => props.onClick()
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-globe"
  }), /* @__PURE__ */ React.createElement("span", null, "Account Settings")), /* @__PURE__ */ React.createElement("footer", {
    className: "footer"
  }, /* @__PURE__ */ React.createElement("form", {
    action: "/auth/logout",
    method: "POST"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn",
    type: "submit",
    onClick: () => props.onClick()
  }, "Logout ", user.name)))));
}

// route:/Users/ham/hamish/Strength-Tracker/app/root.jsx
var import_react7 = require("react");

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-QKBNIRMK.css";

// app/components/ui/DashboardNavbar.jsx
var import_react4 = require("@remix-run/react");
function DashboardNavbar(user) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "app-body-navigation flex justifiy-between"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "app-header-logo mb-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "logo"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "logo-title"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "font-extrabold text-2xl"
  }, "Strength"), /* @__PURE__ */ React.createElement("span", {
    className: "font-extrabold text-2xl"
  }, "Tracker")))), /* @__PURE__ */ React.createElement("nav", {
    className: "navigation"
  }, /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: "/dashboard"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-browsers"
  }), /* @__PURE__ */ React.createElement("span", null, "Dashboard")), /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: "/dashboard/prs"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-check-square"
  }), /* @__PURE__ */ React.createElement("span", null, "Personal Records")), /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: "dashboard/workouts"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-swap"
  }), /* @__PURE__ */ React.createElement("span", null, "Workouts")), /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: "/dashboard/exercises"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-file-text"
  }), /* @__PURE__ */ React.createElement("span", null, "Exercises")), /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: "/dashboard/goals"
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-file-text"
  }), /* @__PURE__ */ React.createElement("span", null, "Goals")), /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: `/dashboard/${user.user.id}/profile`
  }, /* @__PURE__ */ React.createElement("i", {
    className: "ph-globe"
  }), /* @__PURE__ */ React.createElement("span", null, "Account Settings"))), /* @__PURE__ */ React.createElement("div", {
    className: "footer"
  }, /* @__PURE__ */ React.createElement("form", {
    action: "/auth/logout",
    method: "POST"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "btn underline",
    type: "submit"
  }, "Logout ", user.user.name))));
}

// app/components/homepage/Footer.jsx
var import_react5 = require("@remix-run/react");
var Footer = () => {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 lg:flex-row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mb-5 lg:w-1/3 lg:mb-0 lg:mr-20"
  }, /* @__PURE__ */ React.createElement("h2", {
    className: "relative mb-4 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none"
  }, "Strength Tracker"), /* @__PURE__ */ React.createElement("p", {
    className: "mb-4 text-gray-900 lg:mb-6"
  }, "Track your workouts, exercises, personal records, exercise goals and volume. Strength Tracker is a project designed and developed by \u200EHamish Henare."), /* @__PURE__ */ React.createElement(import_react5.Link, {
    to: "auth/register",
    "aria-label": "",
    className: "inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
  }, "Register", /* @__PURE__ */ React.createElement("svg", {
    className: "inline-block w-3 ml-2",
    fill: "currentColor",
    viewBox: "0 0 12 12"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z"
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-grow pt-1"
  })));
};

// route:/Users/ham/hamish/Strength-Tracker/app/root.jsx
var links = () => {
  return [
    { rel: "stylesheet", href: tailwind_default },
    {
      rel: "stylesheet",
      href: app_default
    },
    {
      rel: "stylesheet",
      href: mobile_default
    }
  ];
};
var loader = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    user
  };
  return data;
};
function App(params) {
  return /* @__PURE__ */ React.createElement(Document, null, /* @__PURE__ */ React.createElement(Layout, null, /* @__PURE__ */ React.createElement(import_react6.Outlet, null)));
}
function ErrorBoundary(error) {
  console.error(error);
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "Oh no!"), /* @__PURE__ */ React.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), /* @__PURE__ */ React.createElement(import_react6.Links, null)), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(import_react6.Scripts, null), /* @__PURE__ */ React.createElement("script", {
    src: "https://unpkg.com/flowbite@1.4.7/dist/datepicker.js"
  })));
}
function Document({ children, title }) {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react6.Links, null), /* @__PURE__ */ React.createElement("title", null, "Strength Tracker"), /* @__PURE__ */ React.createElement("link", {
    rel: "stylesheet",
    href: "https://use.typekit.net/jwz3lmi.css"
  })), /* @__PURE__ */ React.createElement("body", null, children, true ? /* @__PURE__ */ React.createElement(import_react6.LiveReload, null) : null, /* @__PURE__ */ React.createElement(import_react6.Scripts, null), /* @__PURE__ */ React.createElement("script", {
    src: "https://widget.cloudinary.com/v2.0/global/all.js",
    type: "text/javascript"
  })));
}
function Layout({ children }) {
  let [count, setPage] = (0, import_react7.useState)(0);
  const { user } = (0, import_react6.useLoaderData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, user ? /* @__PURE__ */ React.createElement("div", {
    className: "app flex justifiy-between"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "app-body"
  }, /* @__PURE__ */ React.createElement(DashboardNavbar, {
    user
  }), /* @__PURE__ */ React.createElement("div", {
    className: "app-body-main-content flex justifiy-between flex-col h-full"
  }, count === 1 ? /* @__PURE__ */ React.createElement(MobileNav, {
    user,
    onClick: () => setPage(count = 0)
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mobile-nav__button--close",
    onClick: () => setPage(count = 0)
  })) : null, /* @__PURE__ */ React.createElement("nav", {
    className: "mobile-nav mb-3"
  }, /* @__PURE__ */ React.createElement(import_react6.Link, {
    to: "/dashboard"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "logo-title mobile-title mb-1"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "text-xl font-bold"
  }, "Strength"), /* @__PURE__ */ React.createElement("span", {
    className: "text-xl font-bold"
  }, "Tracker"))), /* @__PURE__ */ React.createElement("div", {
    className: "mobile-nav__button",
    onClick: () => setPage(count = 1)
  })), children))) : /* @__PURE__ */ React.createElement("container", {
    className: "homepage-container w-5/6"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: "homepage__navbar w-full"
  }, /* @__PURE__ */ React.createElement(import_react6.Link, {
    className: "home-logo logo--animation",
    to: "/"
  }, "Strength Tracker"), /* @__PURE__ */ React.createElement("div", {
    className: "navbar-buttons__div"
  }, /* @__PURE__ */ React.createElement(import_react6.Link, {
    className: "mr-3 underline underline-offset-2",
    to: "/auth/register"
  }, "Register"), /* @__PURE__ */ React.createElement(import_react6.Link, {
    className: "underline underline-offset-2",
    to: "/auth/login"
  }, "Login"))), /* @__PURE__ */ React.createElement("div", {
    className: "w-full"
  }, children), /* @__PURE__ */ React.createElement(Footer, null)));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/$exerciseId.pr-new.jsx
var exerciseId_pr_new_exports = {};
__export(exerciseId_pr_new_exports, {
  action: () => action,
  default: () => exerciseId_pr_new_default,
  loader: () => loader2
});
var import_node3 = require("@remix-run/node");
var import_react10 = require("@remix-run/react");

// app/routes/dashboard/prs/new.jsx
var import_node2 = require("@remix-run/node");
var import_react9 = require("@remix-run/react");

// app/components/ui/PagesNavbar.jsx
var import_react8 = require("@remix-run/react");
function Navbar(data) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "dashboard-section-navbar flex justify-between"
  }, /* @__PURE__ */ React.createElement("h2", {
    className: "text-2xl font-bold"
  }, data.data[0]), /* @__PURE__ */ React.createElement(import_react8.Link, {
    to: `/dashboard/${data.data[1]}`,
    className: ""
  }, /* @__PURE__ */ React.createElement("span", null, data.data[2])));
}

// app/routes/dashboard/prs/new.jsx
function oneRmCalc(weight, reps) {
  if (reps === 1) {
    return weight;
  } else
    return Math.floor(weight * reps * 0.0333 + weight, 2.5);
}
function goalCalc(weight, reps, goalweight, goalreps) {
  const preplinsTable = {
    100: 1,
    95.5: 2,
    92.2: 3,
    89.2: 4,
    86.3: 5,
    83.7: 6,
    81.1: 7,
    78.6: 8,
    76.2: 9,
    73.9: 10,
    70.7: 11,
    68: 12
  };
  const onerm = oneRmCalc(weight, reps);
  const entries = Object.entries(preplinsTable);
  let percentageStr;
  for (let i = 0; i < entries.length; i++) {
    if (goalreps < entries[i][1]) {
      percentageStr = entries[i][0];
    }
  }
  let percentage = parseInt(percentageStr) / 100;
  let current = onerm * percentage;
  let goal = oneRmCalc(goalweight, goalreps) * percentage;
  let progress = current / goal * 100;
  let remainingPercent = 100 - progress;
  let remainingKg = goal - current;
  if (current >= goal) {
    return [true, progress];
  } else {
    return [false, progress, remainingPercent, remainingKg];
  }
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/$exerciseId.pr-new.jsx
function validateWeight(weight) {
  if (typeof weight !== "number") {
    return "weight should be a number";
  }
}
function validateReps(reps) {
  if (typeof reps !== "number") {
    return "reps should be a number";
  }
}
function badRequest2(data) {
  return (0, import_node3.json)(data, { status: 400 });
}
var loader2 = async ({ params }) => {
  const exercise2 = await db.exercise.findUnique({
    where: {
      id: params.exerciseId
    }
  });
  return exercise2;
};
var action = async ({ request, params }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const repsStr = form.get("reps");
  const weight = parseInt(weightStr);
  const reps = parseInt(repsStr);
  const exerciseId = params.exerciseId;
  const dateStr2 = form.get("date");
  const date2 = new Date(dateStr2).toISOString();
  const user = await getUser(request);
  const fields = { weight, reps };
  const fieldErrors = {
    weight: validateWeight(weight),
    reps: validateReps(reps)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest2({ fieldErrors, fields });
  }
  const pr = await db.pr.create({
    data: __spreadProps(__spreadValues({}, fields), { userId: user.id, exerciseId, date: date2 })
  });
  const goals = await db.goals.findMany({
    where: { userId: user.id, exerciseId }
  });
  const goalWeight = goals[0].weight;
  const goalReps = goals[0].reps;
  const goalId = goals[0].id;
  const results = goalCalc(weight, reps, goalWeight, goalReps);
  if (results[0] === true) {
    await db.goals.update({
      where: { id: goalId },
      data: {
        achieved: true,
        achievementDate: date2
      }
    });
  }
  return (0, import_node3.redirect)(`/dashboard/exercises/${exerciseId}`);
};
function NewPr() {
  var _a, _b, _c, _d;
  const actionData = (0, import_react10.useActionData)();
  const exercise2 = (0, import_react10.useLoaderData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "page-header"
  }, /* @__PURE__ */ React.createElement("h1", null, "New PR for ", exercise2.title), /* @__PURE__ */ React.createElement(import_react10.Link, {
    to: "/dashboard",
    className: ""
  }, "Back")), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(import_react10.Form, {
    method: "POST"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h5", null, "Date of workout:"), /* @__PURE__ */ React.createElement("input", {
    type: "date",
    id: "start",
    name: "date",
    defaultValue: date,
    min: userJoinDate,
    max: date,
    required: true
  })), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "weight"
  }, "weight"), /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "weight",
    id: "weight"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("p", null, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.weight) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.weight)))), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "reps"
  }, "Exercise reps"), /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "reps",
    id: "reps"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("p", null, ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.reps) && ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.reps)))), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: ""
  }, "Add PR"))));
}
var exerciseId_pr_new_default = NewPr;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/$exerciseId.volume.jsx
var exerciseId_volume_exports = {};
__export(exerciseId_volume_exports, {
  action: () => action2,
  default: () => exerciseId_volume_default,
  loader: () => loader3
});
var import_node4 = require("@remix-run/node");
var import_react11 = require("@remix-run/react");
function validateWeight2(weight) {
  if (typeof weight !== "number") {
    return "weight should be atleast 2 characters long";
  }
}
function validateReps2(reps) {
  if (typeof reps !== "number") {
    return "reps should be atleast 2 characters long";
  }
}
function badRequest3(data) {
  return (0, import_node4.json)(data, { status: 400 });
}
var loader3 = async ({ params }) => {
  const exercise2 = await db.exercise.findUnique({
    where: {
      id: params.exerciseId
    }
  });
  return exercise2;
};
var action2 = async ({ request, params }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const repsStr = form.get("reps");
  const setsStr = form.get("sets");
  const weight = parseInt(weightStr);
  const sets = parseInt(setsStr);
  const reps = parseInt(repsStr);
  const exerciseId = params.exerciseId;
  const user = await getUser(request);
  const fields = { weight, reps, sets };
  const fieldErrors = {
    weight: validateWeight2(weight),
    reps: validateReps2(reps)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest3({ fieldErrors, fields });
  }
  const volume = await db.volume.create({
    data: __spreadProps(__spreadValues({}, fields), { userId: user.id, exerciseId })
  });
  return (0, import_node4.redirect)(`/dashboard/${exerciseId}`);
};
function NewPr2() {
  var _a, _b, _c, _d, _e, _f;
  const actionData = (0, import_react11.useActionData)();
  const exercise2 = (0, import_react11.useLoaderData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("h1", null, "Add volume for the ", exercise2.title), /* @__PURE__ */ React.createElement(import_react11.Link, {
    to: "/dashboard",
    className: ""
  }, "Back")), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(import_react11.Form, {
    method: "POST"
  }, /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "weight"
  }, "Weight"), /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "weight",
    id: "weight"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("p", null, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.weight) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.weight)))), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "reps"
  }, "Reps"), /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "reps",
    id: "reps"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("p", null, ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.reps) && ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.reps)))), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "reps"
  }, "Sets"), /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "sets",
    id: "sets"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("p", null, ((_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.sets) && ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.sets)))), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: ""
  }, "Add Volume"))));
}
var exerciseId_volume_default = NewPr2;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/$exerciseId.$pr.jsx
var exerciseId_pr_exports = {};
__export(exerciseId_pr_exports, {
  default: () => exerciseId_pr_default,
  loader: () => loader4
});
var import_react14 = require("@remix-run/react");

// app/routes/dashboard/exercises/$exerciseId.jsx
var import_node5 = require("@remix-run/node");
var import_react12 = require("@remix-run/react");

// app/components/PrTable.jsx
var React2 = __toESM(require("react"));
function PrTable_default({ prs }) {
  const dateConvertor2 = (prDate) => {
    let date2 = new Date(prDate).toDateString();
    let dateArr = date2.split(" ");
    dateArr.shift();
    let yearArr = dateArr.pop();
    let yearSplit = yearArr.split("");
    let year = yearSplit.slice(2, 4).join("");
    dateArr.push(year);
    let month = dateArr[0];
    dateArr[0] = dateArr[1];
    dateArr[1] = month;
    return dateArr.join(" ");
  };
  return /* @__PURE__ */ React2.createElement("div", {
    className: "overflow-scroll h-auto max-h-1/2 pr-table__div my-10"
  }, /* @__PURE__ */ React2.createElement("table", {
    className: "w-full flex flex-row flex-no-wrap rounded-lg sm:shadow-lg mb-5"
  }, /* @__PURE__ */ React2.createElement("thead", {
    className: "text-white"
  }, /* @__PURE__ */ React2.createElement("tr", {
    className: "bg-neutral-500	3 flex flex-row flex-no wrap sm:table-row sm:rounded-none mb-2 sm:mb-0 justify-between"
  }, /* @__PURE__ */ React2.createElement("th", {
    className: "p-3 text-left"
  }, "Date"), /* @__PURE__ */ React2.createElement("th", {
    className: "p-3 text-left"
  }, "Weight"), /* @__PURE__ */ React2.createElement("th", {
    className: "p-3 text-left"
  }, "Reps"), /* @__PURE__ */ React2.createElement("th", {
    className: "p-3 text-left"
  }, "Est 1RM"))), /* @__PURE__ */ React2.createElement("tbody", {
    className: "flex-1 sm:flex-none"
  }, prs.map((pr, index6) => {
    return /* @__PURE__ */ React2.createElement("tr", {
      key: pr.id,
      className: "flex flex-row flex-no wrap sm:table-row sm:mb-0 hover:bg-neutral-500 sm:p-3 w-full px-2 justify-between hover:text-white"
    }, /* @__PURE__ */ React2.createElement("td", {
      className: "w-1/4 sm:w-auto md:p-3"
    }, dateConvertor2(pr.date)), /* @__PURE__ */ React2.createElement("td", {
      className: "w-1/4 sm:w-auto md:p-3"
    }, pr.weight, "kg"), /* @__PURE__ */ React2.createElement("td", {
      className: "w-1/4 sm:w-auto md:p-3"
    }, pr.reps), /* @__PURE__ */ React2.createElement("td", {
      className: "w-1/4 sm:w-auto md:p-3"
    }, OneRmEstimate(pr.weight, pr.reps), "kg"));
  }))));
}

// app/components/Chart.jsx
var import_recharts = require("recharts");
var dateConvertor = (prDate) => {
  let date2 = new Date(prDate).toDateString();
  let dateArr = date2.split(" ");
  dateArr.shift();
  return dateArr.join(" ");
};
var OneRmEstimate2 = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};
function Chart(pr) {
  const container = {};
  let prArray2 = [];
  const prLength = pr.pr.length;
  const prObj = pr.pr;
  for (let i = prLength - 1; i >= 0; i--) {
    container[i] = {};
    container[i].date = dateConvertor(prObj[i]["createdAt"], i);
    container[i]["1RM"] = OneRmEstimate2(prObj[i]["weight"], prObj[i]["reps"]);
    prArray2.push(container[i]);
  }
  return /* @__PURE__ */ React.createElement(import_recharts.ResponsiveContainer, {
    width: "100%",
    height: "60%",
    className: "chart__container"
  }, /* @__PURE__ */ React.createElement(import_recharts.LineChart, {
    width: 800,
    height: 300,
    data: prArray2,
    margin: {
      top: 5,
      bottom: 5
    }
  }, /* @__PURE__ */ React.createElement(import_recharts.CartesianGrid, {
    strokeDasharray: "3 3"
  }), /* @__PURE__ */ React.createElement(import_recharts.XAxis, {
    dataKey: "date"
  }), /* @__PURE__ */ React.createElement(import_recharts.YAxis, null), /* @__PURE__ */ React.createElement(import_recharts.Tooltip, null), /* @__PURE__ */ React.createElement(import_recharts.Legend, null), /* @__PURE__ */ React.createElement(import_recharts.Line, {
    type: "monotone",
    dataKey: "1RM",
    stroke: "#82ca9d"
  })));
}

// app/routes/dashboard/exercises/$exerciseId.jsx
var import_react13 = require("react");
var OneRmEstimate = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/$exerciseId.$pr.jsx
var loader4 = async ({ params }) => {
  const exercise2 = params.exerciseId;
  if (!exercise2)
    throw new Error("exercise not found");
  const pr = await db.pr.findUnique({
    where: {
      id: params.pr
    }
  });
  const data = { exercise: exercise2, pr };
  return data;
};
function prPage() {
  const { exercise: exercise2, pr } = (0, import_react14.useLoaderData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Weight"), /* @__PURE__ */ React.createElement("td", null, pr.weight)), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Reps"), /* @__PURE__ */ React.createElement("td", null, pr.reps)), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Projected 1rm"), /* @__PURE__ */ React.createElement("td", null, OneRmEstimate(pr.weight, pr.reps))), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Date"), /* @__PURE__ */ React.createElement("td", null, new Date(pr.createdAt).toLocaleString())))), /* @__PURE__ */ React.createElement(import_react14.Link, {
    to: `../${exercise2}`
  }, "Back"));
}
var exerciseId_pr_default = prPage;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/$exerciseId.jsx
var exerciseId_exports = {};
__export(exerciseId_exports, {
  OneRmEstimate: () => OneRmEstimate3,
  action: () => action3,
  default: () => exerciseId_default,
  loader: () => loader5
});
var import_node6 = require("@remix-run/node");
var import_react15 = require("@remix-run/react");
var import_react16 = require("react");
var loader5 = async ({ request, params }) => {
  const user = await getUser(request);
  const exercise2 = await db.exercise.findUnique({
    where: { id: params.exerciseId }
  });
  if (!exercise2)
    throw new Error("exercise not found");
  const pr = await db.pr.findMany({
    where: {
      userId: {
        equals: `${user.id}`
      },
      exerciseId: {
        equals: `${exercise2.id}`
      }
    },
    orderBy: {
      date: "asc"
    }
  });
  const oneRepMax = weightLoop(pr);
  const data = { exercise: exercise2, user, pr, oneRepMax };
  return data;
};
var weightLoop = (pr) => {
  let arr = [];
  for (let i = 0; i < pr.length; i++) {
    arr.push(OneRmEstimate3(pr[i].weight, pr[i].reps));
  }
  return Math.max(...arr);
};
var action3 = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const user = await getUser(request);
    const exercise2 = await db.exercise.findUnique({
      where: { id: params.exerciseId }
    });
    if (!exercise2)
      throw new Error("exercise not found");
    if (user && exercise2.userId === user.id) {
      await db.exercise.delete({ where: { id: params.exerciseId } });
    }
    return (0, import_node6.redirect)("/dashboard");
  }
  let data = form.get("_rename");
  if (data != void 0 || data != "" || data.length != 1) {
    const exercise2 = await db.exercise.findUnique({
      where: { id: params.exerciseId }
    });
    await db.exercise.update({
      where: { id: params.exerciseId },
      data: {
        title: data
      }
    });
  }
  return (0, import_node6.redirect)(`/dashboard/exercises/${params.exerciseId}`);
};
var OneRmEstimate3 = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};
function exercise() {
  const { exercise: exercise2, user, pr, oneRepMax } = (0, import_react15.useLoaderData)();
  const latestPr = pr[0];
  let currentEstimatedPr = null;
  if (latestPr === void 0 || pr.length === 0) {
    console.log("no pr");
  } else {
    currentEstimatedPr = OneRmEstimate3(latestPr.weight, latestPr.reps);
  }
  let [count, setPage] = (0, import_react16.useState)(0);
  return /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, count === 1 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("form", {
    method: "POST",
    className: ""
  }, /* @__PURE__ */ React.createElement("input", {
    className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    name: "_rename",
    type: "text",
    placeholder: exercise2.title
  }), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "ml-3 mr-3"
  }, "Save"), /* @__PURE__ */ React.createElement("a", {
    className: "",
    onClick: () => setPage(count = 0)
  }, "Cancel"))), count === 0 && /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-row items-center justify-between"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-row items-center"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-xl font-bold underline underline-offset-1 mr-3",
    onClick: () => setPage(count = 1)
  }, exercise2.title), /* @__PURE__ */ React.createElement("a", {
    className: "menu-item underline underline-offset-2",
    onClick: () => setPage(count = 1)
  }, "Rename")), /* @__PURE__ */ React.createElement(import_react15.Link, {
    to: "/dashboard",
    className: "font-bold"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "underline underline-offset-2 "
  }, "Back"))), pr.length > 0 ? /* @__PURE__ */ React.createElement("div", {
    className: "mt-3 mb-3"
  }, /* @__PURE__ */ React.createElement("h4", null, "Current estimated PR: ", currentEstimatedPr, "kg"), /* @__PURE__ */ React.createElement("h4", null, "Best estimated PR recorded: ", oneRepMax, "kg")) : null), pr.length > 0 ? /* @__PURE__ */ React.createElement("div", {
    className: "w-full h-5/6"
  }, /* @__PURE__ */ React.createElement(PrTable_default, {
    prs: pr
  }), /* @__PURE__ */ React.createElement(import_react15.Link, {
    to: "./pr-new"
  }, "New PR"), /* @__PURE__ */ React.createElement(Chart, {
    pr
  })) : /* @__PURE__ */ React.createElement("h1", null, "no prs yet :("), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, user.id === exercise2.userId && /* @__PURE__ */ React.createElement("form", {
    method: "POST"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "hidden",
    name: "_method",
    value: "delete"
  }), /* @__PURE__ */ React.createElement("button", {
    className: "underline underline-offset-2"
  }, "Delete exercise"))));
}
var exerciseId_default = exercise;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/workouts/$workoutId.jsx
var workoutId_exports = {};
__export(workoutId_exports, {
  default: () => $workoutId,
  loader: () => loader6,
  nth: () => nth2,
  weeksBetween: () => weeksBetween,
  wordDate: () => wordDate2
});
var import_react27 = require("@remix-run/react");

// app/components/MyGoals.jsx
var import_react17 = require("@remix-run/react");
var dateStr = (a) => {
  let dateSplit = a.split("");
  let dateStr2 = dateSplit.slice(0, 10);
  let newDate = new Date(`${dateStr2.join("")}`);
  let dateArr = newDate.toDateString().split(" ");
  let date2 = dateArr[2] + " " + dateArr[1] + " " + (dateArr[3] - 2e3);
  return date2;
};
function MyGoals(data) {
  let goals;
  data.data.length === 1 ? goals = data.data : goals = data.data[0];
  const achieved = data.data[1];
  console.log(data.data[1]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ul", {
    className: "mt-2"
  }, goals.map((goal) => {
    const date2 = dateStr(goal.achievementGoalDate);
    const reps = goal.reps;
    if (achieved === false && goal.achieved === false) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", {
        key: goal.exerciseId
      }, /* @__PURE__ */ React.createElement("p", {
        className: ""
      }, /* @__PURE__ */ React.createElement(import_react17.Link, {
        to: `exercises/${goal.exerciseId}`,
        className: "underline font-bold"
      }, goal.Exercise.title), " ", /* @__PURE__ */ React.createElement("b", null, goal.weight, "kg"), " for", " ", /* @__PURE__ */ React.createElement("b", null, reps < 2 ? ` 1 rep` : ` ${reps} reps`), " by ", date2)));
    } else if (goal.achieved === true && achieved === true) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", {
        key: goal.exerciseId,
        className: "mb-2"
      }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(import_react17.Link, {
        to: `../dashboard/exercises/${goal.exerciseId}`
      }, goal.Exercise.title), " ", /* @__PURE__ */ React.createElement("b", null, goal.weight, "kg"), " for", " ", /* @__PURE__ */ React.createElement("b", null, reps < 2 ? ` 1 rep` : ` ${reps} reps`), " by ", date2)));
    }
  })));
}

// app/components/ui/PrNav.jsx
var import_react18 = require("@remix-run/react");
function PrNavbar(data) {
  const str = data.data[0];
  const strSplit = str.split(" ");
  const id = strSplit[strSplit.length - 1];
  let titleArr;
  let title;
  if (strSplit.length > 3) {
    titleArr = strSplit.slice(0, strSplit.length - 2);
    title = titleArr.join(" ");
  } else {
    title = strSplit[0];
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "dashboard-section-navbar mt-5 sm:mt-10 pr-15"
  }, /* @__PURE__ */ React.createElement(import_react18.Link, {
    to: `../dashboard/exercises/${id}`
  }, /* @__PURE__ */ React.createElement("h2", {
    className: "text-xl font-bold"
  }, title)), /* @__PURE__ */ React.createElement(import_react18.Link, {
    to: `../dashboard/exercises/${id}/pr-new`
  }, /* @__PURE__ */ React.createElement("p", {
    className: "",
    style: { "paddingRight": 68 + "px" }
  }, "New PR")));
}

// app/components/MyWorkouts.jsx
var import_react_masonry_css = __toESM(require("react-masonry-css"));

// app/routes/dashboard/workouts/index.jsx
var import_react24 = require("@remix-run/react");

// app/routes/dashboard/index.jsx
var import_react21 = require("@remix-run/react");

// app/components/MyExercises.jsx
var import_react19 = require("@remix-run/react");
var OneRmEstimate4 = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};
function MyExercise({ exercises }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "exercise-list__div w-full"
  }, exercises.map((exercise2, index6) => {
    let dateSplit = exercise2.updatedAt.split("");
    let dateStr2 = dateSplit.slice(0, 10);
    let newDate = new Date(`${dateStr2.join("")}`);
    let dateArr = newDate.toDateString().split(" ");
    let date2 = dateArr[2] + " " + dateArr[1] + " " + dateArr[3];
    let oneRm;
    let weight;
    let reps;
    exercise2["Pr"].length === 0 ? oneRm = null : (weight = exercise2["Pr"][0]["weight"], reps = exercise2["Pr"][0]["reps"], oneRm = OneRmEstimate4(weight, reps));
    return /* @__PURE__ */ React.createElement("div", {
      className: "transfer w-full flex justify-between",
      key: exercise2.id
    }, /* @__PURE__ */ React.createElement("dl", {
      className: "transfer-details w-full"
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(import_react19.Link, {
      to: `/dashboard/exercises/${exercise2.id}`
    }, exercise2.title)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, oneRm === null ? "No PR" : oneRm + "kg"), /* @__PURE__ */ React.createElement("dd", null, "Best 1RM Estimate")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, date2), /* @__PURE__ */ React.createElement("dd", null, "Last updated"))));
  }));
}

// app/components/ui/DashboardContentNavbar.jsx
var import_react20 = require("@remix-run/react");
function Navbar2(data) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "dashboard-section-navbar"
  }, /* @__PURE__ */ React.createElement("h2", {
    className: "text-xl font-bold"
  }, data.data[0]), /* @__PURE__ */ React.createElement("div", {
    className: "dashboard-section-navbar__links"
  }, /* @__PURE__ */ React.createElement(import_react20.Link, {
    to: `/dashboard/${data.data[1]}`,
    className: "underline"
  }, /* @__PURE__ */ React.createElement("span", null, "New")), /* @__PURE__ */ React.createElement(import_react20.Link, {
    to: `/dashboard/${data.data[2]}`,
    className: "underline"
  }, "View all")));
}

// app/components/error handling/NestedError.jsx
function NestedError() {
  return /* @__PURE__ */ React.createElement("div", null);
}

// app/routes/dashboard/index.jsx
function getEndOfWeek(d, week) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1) + week;
  return new Date(d.setDate(diff));
}

// app/components/ui/WorkoutDateNav.jsx
function WorkoutNavbar(data) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "dashboard-section-navbar mb-4"
  }, /* @__PURE__ */ React.createElement("h2", {
    className: "text-xl font-bold"
  }, data.data[0], " - ", data.data[1]));
}

// app/components/ui/WorkoutChart.jsx
var import_react22 = __toESM(require("react"));
var import_recharts2 = require("recharts");
var import_react23 = require("react");
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = (0, import_react23.useState)(getWindowDimensions());
  (0, import_react23.useEffect)(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}
var CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ import_react22.default.createElement("div", {
      className: "custom-tooltip"
    }, payload[0].value === 0 ? /* @__PURE__ */ import_react22.default.createElement("p", {
      className: "label"
    }, `${label}: No workouts this week`) : payload[0].value === 1 ? /* @__PURE__ */ import_react22.default.createElement("p", {
      className: "label"
    }, `${label}: ${payload[0].value} workout`) : /* @__PURE__ */ import_react22.default.createElement("p", {
      className: "label"
    }, `${label}: ${payload[0].value} workouts`));
  }
  return null;
};
function WorkoutChart(data) {
  let screenHeight;
  let screenWidth;
  if (typeof window !== "undefined") {
    screenWidth = useWindowDimensions().width;
    screenHeight = useWindowDimensions().height;
    return /* @__PURE__ */ import_react22.default.createElement(import_recharts2.ResponsiveContainer, {
      width: "100%",
      height: "95%",
      className: "chart__container"
    }, /* @__PURE__ */ import_react22.default.createElement(import_recharts2.LineChart, {
      width: screenWidth,
      height: screenHeight,
      data: data.data,
      margin: {
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }
    }, /* @__PURE__ */ import_react22.default.createElement(import_recharts2.CartesianGrid, {
      strokeDasharray: "3 3"
    }), /* @__PURE__ */ import_react22.default.createElement(import_recharts2.XAxis, {
      dataKey: "date"
    }), /* @__PURE__ */ import_react22.default.createElement(import_recharts2.YAxis, null), /* @__PURE__ */ import_react22.default.createElement(import_recharts2.Tooltip, {
      content: /* @__PURE__ */ import_react22.default.createElement(CustomTooltip, null)
    }), /* @__PURE__ */ import_react22.default.createElement(import_recharts2.Line, {
      type: "monotone",
      dataKey: "Workouts Per Week",
      stroke: "#8884d8",
      activeDot: { r: 8 }
    })));
  } else {
    return /* @__PURE__ */ import_react22.default.createElement(import_react22.default.Fragment, null, "Loading..");
  }
}

// app/routes/dashboard/workouts/index.jsx
var nth = (number) => {
  let selector;
  if (number <= 0) {
    selector = 4;
  } else if (number > 3 && number < 21 || number % 10 > 3) {
    selector = 0;
  } else {
    selector = number % 10;
  }
  return number + ["th", "st", "nd", "rd", ""][selector];
};
function wordDate(isoDate) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const date2 = new Date(isoDate);
  const day = date2.getDate();
  const year = date2.getFullYear();
  const month = date2.getMonth();
  const dateStr2 = nth(day) + " " + months[month];
  return dateStr2;
}

// app/components/MyWorkouts.jsx
var import_react25 = require("@remix-run/react");
function MyWorkouts({ data }) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };
  const workoutData = data;
  if (data === void 0) {
    return null;
  } else {
    let workoutArray = [];
    let arr = [];
    workoutData.map((workout) => {
      workoutArray.push(workout);
    });
    for (let i = 0; i < workoutArray.length; i++) {
      const workoutVolume = workoutArray[i].volume;
      let obj = {
        date: workoutArray[i].date,
        volume: workoutVolume,
        id: workoutArray[i].id
      };
      arr.push(obj);
    }
    let exerciseTitleArray = [];
    let workouts = [];
    arr.map((workout) => {
      workout.volume.map((vol) => {
        if (!exerciseTitleArray.includes(vol.Exercise.title)) {
          exerciseTitleArray.push(vol.Exercise.title);
          delete vol.id;
          delete vol.workoutId;
          delete vol.date;
          vol.exercise = vol.Exercise.title;
          delete vol.Exercise;
        } else {
          delete vol.Exercise;
          delete vol.id;
          delete vol.workoutId;
          delete vol.date;
        }
        workouts.push(vol);
      });
    });
    return /* @__PURE__ */ React.createElement(import_react_masonry_css.default, {
      breakpointCols: breakpointColumnsObj,
      className: "my-masonry-grid",
      columnClassName: "my-masonry-grid_column"
    }, arr.map((workout) => {
      return [
        /* @__PURE__ */ React.createElement("div", {
          className: "workout-card"
        }, /* @__PURE__ */ React.createElement(import_react25.Link, {
          to: `/dashboard/workouts/${workout.id}`
        }, /* @__PURE__ */ React.createElement("h4", null, wordDate(workout.date))), workout.volume.map((vol) => {
          return /* @__PURE__ */ React.createElement("div", {
            className: "workout-card__wrapper"
          }, vol.exercise != void 0 ? /* @__PURE__ */ React.createElement("div", {
            className: "workout-card-heading__div"
          }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(import_react25.Link, {
            to: `exercises/${vol.exerciseId}`
          }, /* @__PURE__ */ React.createElement("h3", null, vol.exercise)))), /* @__PURE__ */ React.createElement("div", {
            className: "workout-card-title__div"
          }, /* @__PURE__ */ React.createElement("p", null, "Weight"), /* @__PURE__ */ React.createElement("p", null, "Reps"), /* @__PURE__ */ React.createElement("p", null, "Sets"))) : null, /* @__PURE__ */ React.createElement("div", {
            className: "workout-card-work__div"
          }, /* @__PURE__ */ React.createElement("p", null, vol.weight, "kg"), /* @__PURE__ */ React.createElement("p", null, vol.reps), /* @__PURE__ */ React.createElement("p", null, vol.sets)));
        }))
      ];
    }));
  }
}

// app/components/IndividualWorkout.jsx
var import_react26 = require("@remix-run/react");
function IndividualWorkout({ data }) {
  const workoutData = [data[0]];
  const exercises = data[1];
  if (data === void 0) {
    return null;
  } else {
    let workoutArray = [];
    let arr = [];
    workoutData.map((workout) => {
      workoutArray.push(workout);
    });
    for (let i = 0; i < workoutArray.length; i++) {
      const workoutVolume = workoutArray[i].volume;
      let obj = {
        date: workoutArray[i].date,
        volume: workoutVolume,
        id: workoutArray[i].id
      };
      arr.push(obj);
    }
    let exerciseTitleArray = [];
    let workouts = [];
    arr.map((workout) => {
      workout.volume.map((vol) => {
        if (!exerciseTitleArray.includes(vol.Exercise.title)) {
          exerciseTitleArray.push(vol.Exercise.title);
          delete vol.workoutId;
          delete vol.date;
          vol.exercise = vol.Exercise.title;
          delete vol.Exercise;
        } else {
          delete vol.Exercise;
          delete vol.workoutId;
          delete vol.date;
        }
        workouts.push(vol);
      });
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, arr.map((workout) => {
      return [
        /* @__PURE__ */ React.createElement("form", {
          className: "workout-card",
          method: "POST"
        }, /* @__PURE__ */ React.createElement(import_react26.Link, {
          to: `/dashboard/workouts/${workout.id}`
        }, /* @__PURE__ */ React.createElement("h4", null, wordDate(workout.date))), workout.volume.map((vol) => {
          return /* @__PURE__ */ React.createElement("div", {
            className: "workout-card__wrapper",
            key: vol.id
          }, vol.exercise != void 0 ? /* @__PURE__ */ React.createElement("div", {
            className: "workout-card-heading__div"
          }, /* @__PURE__ */ React.createElement("select", {
            "aria-label": "Default select example",
            required: true,
            id: "exercise",
            name: "exercise-1"
          }, /* @__PURE__ */ React.createElement("option", {
            defaultValue: vol.exercise
          }, vol.exercise), exercises.map((exercise2) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("option", {
            key: exercise2.id,
            value: exercise2.id
          }, exercise2.title)))), /* @__PURE__ */ React.createElement("div", {
            className: "workout-card-title__div"
          }, /* @__PURE__ */ React.createElement("p", null, "Weight"), /* @__PURE__ */ React.createElement("p", null, "Reps"), /* @__PURE__ */ React.createElement("p", null, "Sets"))) : null, /* @__PURE__ */ React.createElement("div", {
            className: "workout-card-work__div"
          }, /* @__PURE__ */ React.createElement("input", {
            type: "text",
            defaultValue: vol.weight
          }), /* @__PURE__ */ React.createElement("input", {
            type: "text",
            defaultValue: vol.reps
          }), /* @__PURE__ */ React.createElement("input", {
            type: "text",
            defaultValue: vol.sets
          })));
        }), /* @__PURE__ */ React.createElement("button", {
          type: "submit"
        }, "Save"))
      ];
    }));
  }
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/workouts/$workoutId.jsx
var loader6 = async ({ request, params }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id }
  });
  const workout = await db.workout.findUnique({
    where: { id: params.workoutId },
    include: {
      volume: {
        select: {
          date: true,
          exerciseId: true,
          weight: true,
          reps: true,
          sets: true,
          workoutId: true,
          id: true,
          Exercise: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    }
  });
  return [workout, exercises];
};
function weeksBetween(d1, d2) {
  let weeks = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1e3));
  return weeks;
}
var nth2 = (number) => {
  let selector;
  if (number <= 0) {
    selector = 4;
  } else if (number > 3 && number < 21 || number % 10 > 3) {
    selector = 0;
  } else {
    selector = number % 10;
  }
  return number + ["th", "st", "nd", "rd", ""][selector];
};
function wordDate2(isoDate) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const date2 = new Date(isoDate);
  const day = date2.getDate();
  const month = date2.getMonth();
  const dateStr2 = nth2(day) + " " + months[month];
  return dateStr2;
}
function $workoutId() {
  const data = (0, import_react27.useLoaderData)();
  const workouts = data[0];
  const exercises = data[1];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IndividualWorkout, {
    data: [workouts, exercises]
  }));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/$userId.profile.jsx
var userId_profile_exports = {};
__export(userId_profile_exports, {
  action: () => action4,
  default: () => register2,
  loader: () => loader7
});
var import_react28 = __toESM(require("react"));
var import_node7 = require("@remix-run/node");
var import_react29 = require("@remix-run/react");
var import_react30 = require("react");
function badRequest4(data) {
  return (0, import_node7.json)(data, { status: 400 });
}
function goodRequest(data) {
  return (0, import_node7.json)(data, { status: 200 });
}
var loader7 = async ({ request }) => {
  const user = await getUser(request);
  return user;
};
function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  } else if (typeof password !== "string" || password.search(/[0-9]/) == -1) {
    return "Password must contain atleast 1 number";
  } else if (typeof password !== "string" || password.search(/[A-Z]/) == -1) {
    return "Password must contain atleast 1 upper case letter";
  }
}
var action4 = async ({ request, params }) => {
  const form = await request.formData();
  const name = form.get("name");
  if (form.get("_method") === "name") {
    const user = await getUser(request);
    await db.user.update({
      where: { id: user.id },
      data: {
        name
      }
    });
    return null;
  }
  if (form.get("_method") === "email") {
    const user = await getUser(request);
    const email = form.get("email");
    const fields = { email };
    const emailExists = await db.user.findFirst({
      where: {
        email
      }
    });
    if (emailExists) {
      return badRequest4({
        fields,
        fieldErrors: { email: `the email address: ${email} already exists.` }
      });
    }
    await db.user.update({
      where: { id: user.id },
      data: {
        email
      }
    });
    return null;
  }
  if (form.get("_method") === "password") {
    const user = await getUser(request);
    const email = user.email;
    const oldPassword = form.get("old-password");
    const newPassword = form.get("new-password");
    const confirmNewPassword = form.get("confirm-new-password");
    const fields = { oldPassword };
    if (confirmNewPassword != newPassword) {
      return badRequest4({
        fields,
        fieldErrors: { password: "Passwords don't match" }
      });
    }
    const fieldErrors = {
      password: validatePassword(newPassword)
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest4({ fieldErrors, fields });
    }
    const passwordTrue = await changePassword({
      email,
      oldPassword,
      newPassword
    });
    if (!passwordTrue) {
      return badRequest4({
        fields,
        fieldErrors: { password: "Invalid Credentials" }
      });
    }
    return goodRequest({
      fields,
      fieldErrors: { password: "Password changed successfully" }
    });
  }
  return null;
};
function register2() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const actionData = (0, import_react29.useActionData)();
  let [count, setPage] = (0, import_react30.useState)(0);
  const user = (0, import_react29.useLoaderData)();
  return /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "w-full h-full"
  }, count === 1 && /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "w-full lg:w-1/2 h-1/2 flex flex-col justify-between"
  }, /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("form", {
    method: "POST",
    className: "w-full"
  }, /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "hidden",
    name: "_method",
    value: "name"
  }), /* @__PURE__ */ import_react28.default.createElement("div", {
    class: "mb-6"
  }, /* @__PURE__ */ import_react28.default.createElement("label", {
    for: "name",
    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  }, "Edit name"), /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "name",
    id: "name",
    name: "name",
    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    placeholder: user.name,
    required: true
  })), /* @__PURE__ */ import_react28.default.createElement("button", {
    type: "submit",
    class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }, "Submit"))), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("h1", {
    className: "font-bold text-2xl ",
    onClick: () => setPage(count = 2)
  }, user.email), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "menu-item underline",
    onClick: () => setPage(count = 2)
  }, "Edit email")), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "underline",
    onClick: () => setPage(count = 3)
  }, "Change password")), count === 0 && /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "w-full lg:w-1/2 h-1/2 flex flex-col justify-between"
  }, /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("p", {
    className: "font-bold text-2xl ",
    onClick: () => setPage(count = 1)
  }, user.name), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "menu-item underline",
    onClick: () => setPage(count = 1)
  }, "Edit name")), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("p", {
    className: "font-bold text-2xl ",
    onClick: () => setPage(count = 2)
  }, user.email), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "menu-item underline",
    onClick: () => setPage(count = 2)
  }, "Edit email")), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "error"
  }, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.email) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.email)), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "underline",
    onClick: () => setPage(count = 3)
  }, "Change password"), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "error"
  }, ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.password) && ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.password))), count === 2 && /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "w-full lg:w-1/2 h-1/2 flex flex-col justify-between"
  }, /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("h1", {
    className: "font-bold text-2xl ",
    onClick: () => setPage(count = 1)
  }, user.name), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "menu-item underline",
    onClick: () => setPage(count = 1)
  }, "Edit name")), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("form", {
    method: "POST",
    className: "w-full"
  }, /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "hidden",
    name: "_method",
    value: "email"
  }), /* @__PURE__ */ import_react28.default.createElement("div", {
    class: "mb-6"
  }, /* @__PURE__ */ import_react28.default.createElement("label", {
    for: "email",
    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  }, "Email address"), /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "email",
    id: "email",
    name: "email",
    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    placeholder: user.email,
    required: true
  })), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "error"
  }, ((_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.email) && ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.email)), /* @__PURE__ */ import_react28.default.createElement("button", {
    type: "submit",
    class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }, "Submit"))), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "underline",
    onClick: () => setPage(count = 3)
  }, "Change password"), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "error"
  }, ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.password) && ((_h = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _h.password))), count === 3 && /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "w-full lg:w-1/2 h-1/2 flex flex-col justify-between"
  }, /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("h1", {
    className: "font-bold text-2xl ",
    onClick: () => setPage(count = 1)
  }, user.name), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "menu-item",
    onClick: () => setPage(count = 1)
  }, "Edit name")), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "mb-20 flex flex-row justify-between items-center"
  }, /* @__PURE__ */ import_react28.default.createElement("h1", {
    className: "font-bold text-2xl ",
    onClick: () => setPage(count = 2)
  }, user.email), /* @__PURE__ */ import_react28.default.createElement("a", {
    className: "menu-item",
    onClick: () => setPage(count = 2)
  }, "Edit email")), /* @__PURE__ */ import_react28.default.createElement("form", {
    method: "POST"
  }, /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "hidden",
    name: "_method",
    value: "password"
  }), /* @__PURE__ */ import_react28.default.createElement("div", {
    class: "mb-6"
  }, /* @__PURE__ */ import_react28.default.createElement("label", {
    for: "old-password'",
    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  }, "Current password"), /* @__PURE__ */ import_react28.default.createElement("input", {
    name: "old-password",
    type: "password",
    id: "old-password'",
    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    required: true
  })), /* @__PURE__ */ import_react28.default.createElement("div", {
    class: "mb-6"
  }, /* @__PURE__ */ import_react28.default.createElement("label", {
    for: "new-password",
    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  }, "New password"), /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "password",
    name: "new-password",
    id: "new-password",
    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    required: true
  })), /* @__PURE__ */ import_react28.default.createElement("div", {
    class: "mb-6"
  }, /* @__PURE__ */ import_react28.default.createElement("label", {
    for: "confirm-new-password",
    class: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  }, "Confirm password"), /* @__PURE__ */ import_react28.default.createElement("input", {
    type: "password",
    name: "confirm-new-password",
    id: "confirm-new-password",
    class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    required: true
  })), /* @__PURE__ */ import_react28.default.createElement("div", {
    className: "error"
  }, ((_i = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _i.password) && ((_j = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _j.password)), /* @__PURE__ */ import_react28.default.createElement("button", {
    type: "submit",
    class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }, "Submit"))));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/index.jsx
var exercises_exports = {};
__export(exercises_exports, {
  ErrorBoundary: () => ErrorBoundary2,
  default: () => index,
  loader: () => loader8
});
var import_react31 = require("@remix-run/react");
var loader8 = async ({ request }) => {
  const user = await getUser(request);
  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`
        }
      },
      include: {
        Pr: {
          select: {
            weight: true,
            reps: true
          },
          orderBy: { weight: "desc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    })
  };
  return exercises;
};
function ErrorBoundary2(error) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(NestedError, null);
}
function index() {
  const data = (0, import_react31.useLoaderData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["My Exercises", "exercises/new", "New Exercise"]
  }), /* @__PURE__ */ React.createElement(MyExercise, {
    exercises: data["exercises"]
  }));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/workouts/index.jsx
var workouts_exports = {};
__export(workouts_exports, {
  ErrorBoundary: () => ErrorBoundary3,
  default: () => index2,
  loader: () => loader9,
  nth: () => nth3,
  weeksBetween: () => weeksBetween2,
  wordDate: () => wordDate3
});
var import_react32 = require("@remix-run/react");
var loader9 = async ({ request }) => {
  const user = await getUser(request);
  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`
        }
      },
      include: {
        volume: {
          select: {
            date: true,
            exerciseId: true,
            weight: true,
            reps: true,
            sets: true,
            workoutId: true,
            id: true,
            Exercise: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: { date: "desc" }
    })
  };
  return [workouts, user];
};
function weeksBetween2(d1, d2) {
  let weeks = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1e3));
  return weeks;
}
var nth3 = (number) => {
  let selector;
  if (number <= 0) {
    selector = 4;
  } else if (number > 3 && number < 21 || number % 10 > 3) {
    selector = 0;
  } else {
    selector = number % 10;
  }
  return number + ["th", "st", "nd", "rd", ""][selector];
};
function wordDate3(isoDate) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const date2 = new Date(isoDate);
  const day = date2.getDate();
  const year = date2.getFullYear();
  const month = date2.getMonth();
  const dateStr2 = nth3(day) + " " + months[month];
  return dateStr2;
}
function ErrorBoundary3(error) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(NestedError, null);
}
function index2() {
  const data = (0, import_react32.useLoaderData)();
  const workouts = data[0].workouts;
  const userDate = data[1].createdAt;
  const today2 = new Date();
  let weeksArray = [];
  let weeks = weeksBetween2(new Date(userDate), today2);
  for (let i = 0; i < weeks + 2; i++) {
    let newWeek = getEndOfWeek(userDate, i * 7);
    weeksArray.push(newWeek);
  }
  weeksArray.reverse();
  const chartData = [];
  {
    weeksArray.map((week) => {
      let startOfWeek = getEndOfWeek(week, 0).toISOString();
      let endOfWeek = getEndOfWeek(week, 6).toISOString();
      let count = 0;
      for (let i = 0; i < workouts.length; i++) {
        if (workouts[i].date > startOfWeek && workouts[i].date < endOfWeek) {
          count++;
        }
      }
      let obj = {
        date: wordDate3(startOfWeek),
        ["Workouts Per Week"]: count
      };
      chartData.push(obj);
    });
  }
  chartData.reverse();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["My Workouts", "workouts/new", "New Workout"]
  }), /* @__PURE__ */ React.createElement("div", {
    className: "workout-chart__div"
  }, /* @__PURE__ */ React.createElement("h3", null, "Workouts per week"), /* @__PURE__ */ React.createElement(WorkoutChart, {
    data: chartData
  })), weeksArray.map((week) => {
    let startOfWeek = getEndOfWeek(week, 0).toISOString();
    let endOfWeek = getEndOfWeek(week, 6).toISOString();
    let workoutArray = [];
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].date > startOfWeek && workouts[i].date < endOfWeek) {
        workoutArray.push(workouts[i]);
      }
    }
    return /* @__PURE__ */ React.createElement("div", null, workoutArray.length === 0 ? null : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(WorkoutNavbar, {
      data: [wordDate3(startOfWeek), wordDate3(endOfWeek)]
    }), /* @__PURE__ */ React.createElement(MyWorkouts, {
      data: workoutArray
    })));
  }));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/exercises/new.jsx
var new_exports = {};
__export(new_exports, {
  action: () => action5,
  default: () => new_default
});
var import_node8 = require("@remix-run/node");
var import_react33 = require("@remix-run/react");
function validateTitle(title) {
  if (typeof title !== "string" || title.length < 2) {
    return "Title should be atleast 2 characters long";
  }
}
function badRequest5(data) {
  return (0, import_node8.json)(data, { status: 400 });
}
var action5 = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const user = await getUser(request);
  const fields = { title };
  const fieldErrors = {
    title: validateTitle(title)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest5({ fieldErrors, fields });
  }
  const exercise2 = await db.exercise.create({
    data: __spreadProps(__spreadValues({}, fields), { userId: user.id })
  });
  return (0, import_node8.redirect)(`/dashboard/exercises/${exercise2.id}`);
};
function NewExercise() {
  var _a, _b;
  const actionData = (0, import_react33.useActionData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "page-header"
  }, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["New Exercise", "exercises", "Back"]
  })), /* @__PURE__ */ React.createElement("div", {
    className: "page-content"
  }, /* @__PURE__ */ React.createElement("form", {
    method: "POST"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mt-5 mb-10 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: `title`,
    id: "title",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "title",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Exercise name")), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("p", null, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.title) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.title))), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    "aria-current": "page",
    class: "text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }, "Save"))));
}
var new_default = NewExercise;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/volume/index.jsx
var volume_exports = {};
__export(volume_exports, {
  default: () => index3
});
var import_react34 = __toESM(require("react"));
function index3() {
  return /* @__PURE__ */ import_react34.default.createElement("div", null, "All prs");
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/workouts/new.jsx
var new_exports2 = {};
__export(new_exports2, {
  action: () => action6,
  default: () => newWorkout,
  loader: () => loader10
});
var import_node9 = require("@remix-run/node");
var import_react36 = require("@remix-run/react");
var import_react37 = __toESM(require("react"));

// app/components/NewWorkoutForm.jsx
function NewWorkoutForm({ exercises, val }) {
  val = val + 2;
  return /* @__PURE__ */ React.createElement("div", {
    className: "bg-slate-800 py-1 px-3 my-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("select", {
    id: "exercise",
    name: "exercise-1",
    placeholder: "Pick an exercise",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  }, /* @__PURE__ */ React.createElement("option", {
    disabled: true,
    selected: true
  }, "Exercise #", val), exercises.map((exercise2) => /* @__PURE__ */ React.createElement("option", {
    key: exercise2.id,
    value: exercise2.id
  }, exercise2.title)))), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: `weight-${val}`,
    id: "weight",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "weight",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Weight")), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-10 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: `reps-${val}`,
    id: "reps",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "reps",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Reps")), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: `sets-${val}`,
    id: "sets",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "sets",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Sets")));
}

// app/routes/dashboard/prs/index.jsx
var import_react35 = require("@remix-run/react");
var OneRmEstimate5 = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/workouts/new.jsx
var loader10 = async ({ request }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id }
  });
  const data = { user, exercises };
  return data;
};
function validateTitle2(title) {
  if (typeof title !== "string" || title.length < 2) {
    return "Title should be atleast 2 characters long";
  }
}
var prArray = (dataBlock, exerciseList, user) => {
  let prArr = [];
  for (let i = 0; i < exerciseList.length; i++) {
    prArr[i] = {
      exerciseId: dataBlock[i].exerciseId,
      weight: parseInt(dataBlock[i].weight),
      reps: parseInt(dataBlock[i].reps),
      userId: String(user.id)
    };
  }
  return prArr;
};
var action6 = async ({ request }) => {
  const user = await getUser(request);
  let volumeBlock = {};
  let exerciseList = [];
  let volumeArray = [];
  const form = await request.formData();
  let goals = await db.goals.findMany({
    where: { userId: user.id, achieved: false }
  });
  let list = [...form];
  console.log(list);
  if (form.get("_method") === "workout") {
    for (let i = 0; i < list.length; i++) {
      if (list[i][0].includes("exercise") && !list[i][1].includes("Pick an exercise")) {
        let obj = {
          exerciseId: list[i][1],
          weight: list[i + 1][1],
          reps: list[i + 2][1],
          sets: list[i + 3][1]
        };
        volumeArray.push(obj);
        exerciseList.push(list[i][1]);
      }
    }
    let date2 = new Date(form.get("date"));
    let volume = {
      volume: {
        create: []
      }
    };
    for (let i = 0; i < exerciseList.length; i++) {
      volume.volume.create.push({
        exerciseId: "",
        weight: "",
        reps: "",
        sets: "",
        userId: ""
      });
      volume.volume.create[i].exerciseId = String(volumeArray[i].exerciseId);
      volume.volume.create[i].weight = parseInt(volumeArray[i].weight);
      volume.volume.create[i].reps = parseInt(volumeArray[i].reps);
      volume.volume.create[i].sets = parseInt(volumeArray[i].sets);
      volume.volume.create[i].userId = String(user.id);
    }
    const prArr = prArray(volumeArray, exerciseList, user);
    for (let i = 0; i < exerciseList.length; i++) {
      console.log("below");
      console.log(prArr[i].exerciseId);
      let goalWeight;
      let currentWeight;
      let goalId;
      goals.forEach(({ exerciseId, weight, reps }, x) => {
        if (exerciseId === prArr[i].exerciseId) {
          console.log(goals[x]);
          goalWeight = OneRmEstimate5(goals[x].weight, goals[x].reps);
          currentWeight = OneRmEstimate5(prArr[i].weight, prArr[i].reps);
          console.log([goalWeight, currentWeight]);
          goalId = goals[x].id;
        }
      });
      if (goalWeight < currentWeight) {
        let goal = await db.goals.update({
          where: {
            id: goalId
          },
          data: {
            achieved: true,
            achievementDate: date2.toISOString()
          }
        });
      }
      let pr = await db.pr.create({
        data: prArr[i]
      });
    }
    const workout = await db.workout.create({
      data: __spreadValues({
        userId: user.id,
        date: date2
      }, volume),
      include: {
        volume: true
      }
    });
    return (0, import_node9.redirect)(`/dashboard`);
  } else if (form.get("_method") === "exercise") {
    const title = form.get("title");
    const fields = { title };
    const fieldErrors = {
      title: validateTitle2(title)
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      console.log(fieldErrors);
      return badRequest({ fieldErrors, fields });
    }
    const exercise2 = await db.exercise.create({
      data: __spreadProps(__spreadValues({}, fields), { userId: user.id })
    });
    return null;
  }
  return (0, import_node9.redirect)(`/dashboard`);
};
function newWorkout() {
  var _a, _b;
  const actionData = (0, import_react36.useActionData)();
  const [volumeArray, setCount] = (0, import_react37.useState)([]);
  let [count, setPage] = (0, import_react37.useState)(0);
  const updatePageState = (state) => {
    setPage(state);
  };
  const data = (0, import_react36.useLoaderData)();
  const exercises = data.exercises;
  let userDate = data.user.createdAt;
  let split = userDate.split("");
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(split[i]);
  }
  const userJoinDate2 = arr.join("");
  const current = new Date();
  const day = current.getDate();
  let date2;
  day < 10 ? date2 = `${current.getFullYear()}-0${current.getMonth() + 1}-0${current.getDate()}` : date2 = `${current.getFullYear()}-0${current.getMonth() + 1}-0${current.getDate()}`;
  return /* @__PURE__ */ import_react37.default.createElement("div", {
    className: ""
  }, /* @__PURE__ */ import_react37.default.createElement(Navbar, {
    data: ["New Workout", "workouts", "Back"]
  }), /* @__PURE__ */ import_react37.default.createElement(import_react36.Form, {
    method: "post"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "hidden",
    name: "_method",
    value: "workout"
  }), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "relative z-0 w-full mb-6 mt-5 group"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "date",
    name: "date",
    id: "date",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true,
    defaultValue: date2,
    min: userJoinDate2,
    max: date2
  }), /* @__PURE__ */ import_react37.default.createElement("label", {
    for: "date",
    className: "peer-focus:font-medium absolute mb-2 font-bold text-gray-500 text-lg dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 text-left"
  }, "Date of workout")), /* @__PURE__ */ import_react37.default.createElement("div", null, /* @__PURE__ */ import_react37.default.createElement("p", {
    className: "font-bold underline underline-offset-2"
  }, "Working sets:")), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "bg-slate-800 py-1 px-3 my-2"
  }, /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ import_react37.default.createElement("select", {
    id: "exercise",
    name: "exercise-1",
    placeholder: "Pick an exercise",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  }, /* @__PURE__ */ import_react37.default.createElement("option", {
    disabled: true,
    selected: true
  }, "Exercise #1"), exercises.map((exercise2) => /* @__PURE__ */ import_react37.default.createElement("option", {
    key: exercise2.id,
    value: exercise2.id
  }, exercise2.title)))), /* @__PURE__ */ import_react37.default.createElement("div", null, /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "number",
    name: "weight-1",
    id: "weight",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ import_react37.default.createElement("label", {
    for: "weight",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Weight")), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "relative z-0 w-full mb-10 group"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "number",
    name: "reps-1",
    id: "reps",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ import_react37.default.createElement("label", {
    for: "reps",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Reps")), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "number",
    name: "sets-1",
    id: "sets",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ import_react37.default.createElement("label", {
    for: "sets",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Sets")))), volumeArray.map((i) => {
    return /* @__PURE__ */ import_react37.default.createElement(NewWorkoutForm, {
      key: i,
      exercises,
      val: volumeArray[i]
    });
  }), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "fixed bottom-0 flex justify-center flex-col items-center w-full left-0 py-3 bg-dark min-h-auto"
  }, /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "flex w-full justify-center items-center rounded-md shadow-sm"
  }, /* @__PURE__ */ import_react37.default.createElement("a", {
    onClick: () => setCount((volumeArray2) => [...volumeArray2, volumeArray2.length]),
    "aria-current": "page",
    class: "py-2 px-4 text-sm font-medium text-blue-700 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
  }, "New block"), /* @__PURE__ */ import_react37.default.createElement("button", {
    type: "submit",
    class: "py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:focus:text-white"
  }, "Save"), /* @__PURE__ */ import_react37.default.createElement("a", {
    onClick: () => setPage(count = 1),
    href: "#",
    class: "py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
  }, "New exercise")), count === 1 ? /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "page-content mt-3 pb-4"
  }, /* @__PURE__ */ import_react37.default.createElement("form", {
    method: "POST"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "hidden",
    name: "_method",
    value: "exercise"
  }), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "relative z-0 w-full mb-10 group"
  }, /* @__PURE__ */ import_react37.default.createElement("input", {
    type: "text",
    name: `title`,
    id: "title",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ import_react37.default.createElement("label", {
    for: "title",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Exercise name")), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: ""
  }, /* @__PURE__ */ import_react37.default.createElement("p", null, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.title) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.title))), /* @__PURE__ */ import_react37.default.createElement("div", {
    className: "flex w-full justify-center items-center rounded-md shadow-sm"
  }, /* @__PURE__ */ import_react37.default.createElement("button", {
    type: "submit",
    "aria-current": "page",
    class: "py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:focus:text-white"
  }, "Save"), /* @__PURE__ */ import_react37.default.createElement("a", {
    onClick: () => setPage(count = 0),
    href: "#",
    class: "py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
  }, "Cancel")))) : null)));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/goals/index.jsx
var goals_exports = {};
__export(goals_exports, {
  ErrorBoundary: () => ErrorBoundary4,
  default: () => index4,
  loader: () => loader11
});
var import_react38 = require("@remix-run/react");

// app/components/ui/ProgressBar.jsx
function ProgressBar(data) {
  const name = data.data[2];
  const goal = data.data[0];
  const current = data.data[1];
  const percentage = current / goal;
  const currentWidth = 350 * percentage;
  return /* @__PURE__ */ React.createElement("div", {
    className: "progress-bar__div mt-2"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "progress-bar__goal"
  }, /* @__PURE__ */ React.createElement("p", null, goal, "kg"), /* @__PURE__ */ React.createElement("div", {
    className: "progress-bar__current",
    style: { width: currentWidth + "px" }
  }, /* @__PURE__ */ React.createElement("p", null, current, "kg"))));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/goals/index.jsx
var loader11 = async ({ request }) => {
  const user = await getUser(request);
  const goals = await db.goals.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        include: {
          title: true
        },
        include: {
          Pr: {
            select: {
              weight: true,
              reps: true
            },
            orderBy: {
              createdAt: "asc"
            },
            take: 1
          }
        }
      }
    }
  });
  const exercises = await db.exercise.findMany({
    where: { userId: user.id }
  });
  const data = { user, goals, exercises };
  return data;
};
function ErrorBoundary4(error) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(NestedError, null);
}
function index4() {
  const data = (0, import_react38.useLoaderData)();
  const user = data.user;
  const goals = data.goals;
  const exercises = data.exercises;
  const newGoalData = [user, exercises];
  let achievedArr = [];
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].achieved === true) {
      achievedArr.push(i);
    }
  }
  const notAchieved = [goals, false];
  const achieved = [goals, true];
  let goalData = [];
  goals.map((goal) => {
    if (goal.achieved === false) {
      let weight = goal.Exercise.Pr[0].weight;
      let reps = goal.Exercise.Pr[0].reps;
      let obj = {
        name: goal.Exercise.title,
        goal: goal.weight,
        current: OneRmEstimate5(weight, reps),
        goalData: [goal]
      };
      goalData.push(obj);
    } else {
      null;
    }
  });
  return /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["My Goals", "goals/new", "New Goal"]
  }), goalData.map((data2) => {
    let goal = data2.goal;
    let current = data2.current;
    let name = data2.name;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MyGoals, {
      data: [data2.goalData, false]
    }), /* @__PURE__ */ React.createElement(ProgressBar, {
      data: [goal, current, name]
    }));
  }), achievedArr.length != 0 ? /* @__PURE__ */ React.createElement("div", {
    className: "mt-4"
  }, /* @__PURE__ */ React.createElement("h2", {
    className: "mb-2 font-bold underline-offset-1 underline"
  }, "Goals I've accomplished so far:"), /* @__PURE__ */ React.createElement(MyGoals, {
    data: achieved
  })) : null));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/goals/new.jsx
var new_exports3 = {};
__export(new_exports3, {
  action: () => action7,
  default: () => newPr,
  loader: () => loader12
});
var import_node10 = require("@remix-run/node");
var import_react39 = require("@remix-run/react");
var loader12 = async ({ request }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id }
  });
  return { exercises, user };
};
var action7 = async ({ request }) => {
  const form = await request.formData();
  const weightStr = form.get("weight");
  const repsStr = form.get("reps");
  const id = form.get("exercise");
  const weight = parseInt(weightStr);
  const user = await getUser(request);
  let reps = parseInt(repsStr);
  const achievementGoalDateStr = form.get("date");
  const achievementGoalDate = new Date(achievementGoalDateStr);
  if (repsStr === null) {
    reps = 1;
  }
  const fields = { weight, reps, achievementGoalDate };
  const goal = await db.goals.create({
    data: __spreadProps(__spreadValues({}, fields), { userId: user.id, exerciseId: id })
  });
  return (0, import_node10.redirect)(`/dashboard`);
};
function newPr() {
  const data = (0, import_react39.useLoaderData)();
  const actionData = (0, import_react39.useActionData)();
  let userDate = data.user.createdAt;
  let split = userDate.split("");
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(split[i]);
  }
  const userJoinDate2 = arr.join("");
  const current = new Date();
  const day = current.getDate();
  let date2;
  day < 10 ? date2 = `${current.getFullYear()}-0${current.getMonth() + 1}-0${current.getDate()}` : date2 = `${current.getFullYear()}-0${current.getMonth() + 1}-0${current.getDate()}`;
  return /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["New Goal", "goals", "Back"]
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(import_react39.Form, {
    method: "POST",
    className: "mt-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("select", {
    id: "exercise",
    name: "exercise",
    placeholder: "Pick an exercise",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  }, /* @__PURE__ */ React.createElement("option", {
    disabled: true,
    selected: true
  }, "Pick an exercise"), data.exercises.map((exercise2) => /* @__PURE__ */ React.createElement("option", {
    key: exercise2.id,
    value: exercise2.id
  }, exercise2.title)))), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "weight",
    id: "weight",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "weight",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Weight")), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-10 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "reps",
    id: "reps",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "reps",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Reps")), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 mt-2 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "date",
    name: "date",
    id: "date",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true,
    defaultValue: date2,
    min: userJoinDate2,
    max: date2
  }), /* @__PURE__ */ React.createElement("label", {
    for: "date",
    className: "peer-focus:font-medium absolute mb-2 text-gray-500 text-lg dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 text-left"
  }, "Date")), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }, "Submit"))));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/prs/index.jsx
var prs_exports = {};
__export(prs_exports, {
  ErrorBoundary: () => ErrorBoundary5,
  OneRmEstimate: () => OneRmEstimate6,
  default: () => index5,
  loader: () => loader13
});
var import_react40 = require("@remix-run/react");
var loader13 = async ({ request }) => {
  const user = await getUser(request);
  const prs = await db.pr.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        select: {
          title: true,
          id: true
        }
      }
    },
    orderBy: {
      exerciseId: "asc"
    }
  });
  const exercises = await db.exercise.findMany({
    where: { userId: user.id }
  });
  const data = { user, prs, exercises };
  return data;
};
function ErrorBoundary5(error) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(NestedError, null);
}
var OneRmEstimate6 = (weight, reps) => {
  const unRounded1RM = weight * reps * 0.0333 + weight;
  return reps === 1 ? weight : Math.round(unRounded1RM / 2.5, 1) * 2.5;
};
function index5() {
  const data = (0, import_react40.useLoaderData)();
  const prData = data.prs;
  let prTempArray = [];
  let prs = prData.filter((pr) => pr["Exercise"] != null);
  prs.map((pr, i) => {
    prTempArray.push(pr["Exercise"].title + " ID: " + pr["Exercise"].id);
  });
  let prArray2 = [...new Set(prTempArray)];
  for (let i = 0; i < prArray2.length; i++) {
    let name = prArray2[i];
    prArray2[i] = [name];
  }
  prs.map((pr) => {
    for (let i = 0; i < prArray2.length; i++) {
      let strSplit = prArray2[i][0].split(" ");
      let titleArr;
      let title;
      if (strSplit.length > 3) {
        titleArr = strSplit.slice(0, strSplit.length - 2);
        title = titleArr.join(" ");
      } else {
        title = strSplit[0];
      }
      if (pr["Exercise"].title === title) {
        let obj = {
          date: pr.createdAt,
          weight: pr.weight,
          reps: pr.reps,
          oneRm: OneRmEstimate6(pr.weight, pr.reps)
        };
        prArray2[i].push(obj);
      }
    }
  });
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "mt-2"
  }, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["My Personal Records", "prs/new", "New PR"]
  })), prArray2.map((pr) => {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PrNavbar, {
      data: [pr[0]]
    }), /* @__PURE__ */ React.createElement("div", {
      className: "overflow-scroll h-auto max-h-1/2 pr-table__div"
    }, /* @__PURE__ */ React.createElement("table", {
      className: "w-full flex flex-row flex-no-wrap rounded-lg sm:shadow-lg my-5"
    }, /* @__PURE__ */ React.createElement("thead", {
      className: "text-white"
    }, /* @__PURE__ */ React.createElement("tr", {
      className: "bg-neutral-500	3 flex flex-row flex-no wrap sm:table-row sm:rounded-none mb-2 sm:mb-0 justify-between"
    }, /* @__PURE__ */ React.createElement("th", {
      className: "p-3 text-left"
    }, "Date"), /* @__PURE__ */ React.createElement("th", {
      className: "p-3 text-left"
    }, "Weight"), /* @__PURE__ */ React.createElement("th", {
      className: "p-3 text-left"
    }, "Reps"), /* @__PURE__ */ React.createElement("th", {
      className: "p-3 text-left"
    }, "Estimated 1rm"))), /* @__PURE__ */ React.createElement("tbody", {
      className: "flex-1 sm:flex-none"
    }, pr.map((individualPrs) => {
      return individualPrs.weight === void 0 ? null : /* @__PURE__ */ React.createElement("tr", {
        className: "flex flex-row flex-no wrap sm:table-row sm:mb-0 hover:bg-neutral-500 sm:p-3 w-full px-2 justify-between hover:text-white"
      }, /* @__PURE__ */ React.createElement("td", {
        className: "w-1/4 sm:w-auto md:p-3"
      }, individualPrs.date === void 0 ? null : dateStr(new String(individualPrs.date))), /* @__PURE__ */ React.createElement("td", {
        className: "w-1/4 sm:w-auto   md:p-3"
      }, individualPrs.weight, "kg"), /* @__PURE__ */ React.createElement("td", {
        className: "w-1/4 sm:w-auto  md:p-3"
      }, individualPrs.reps), /* @__PURE__ */ React.createElement("td", {
        className: "w-1/4 sm:w-auto md:p-3"
      }, individualPrs.oneRm, "kg"));
    })))));
  }));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/prs/new.jsx
var new_exports4 = {};
__export(new_exports4, {
  action: () => action8,
  default: () => newPr2,
  findDate: () => findDate,
  goalCalc: () => goalCalc2,
  loader: () => loader14
});
var import_node11 = require("@remix-run/node");
var import_react41 = require("@remix-run/react");
function validateweight(weight) {
  if (typeof weight !== "number") {
    return "weight should be a number";
  }
}
function validatereps(reps) {
  if (typeof reps !== "number") {
    return "reps should be a number";
  }
}
function badRequest6(data) {
  return json(data, { status: 400 });
}
var loader14 = async ({ request }) => {
  const user = await getUser(request);
  const exercises = await db.exercise.findMany({
    where: { userId: user.id }
  });
  return [exercises, user];
};
function oneRmCalc2(weight, reps) {
  if (reps === 1) {
    return weight;
  } else
    return Math.floor(weight * reps * 0.0333 + weight, 2.5);
}
function goalCalc2(weight, reps, goalweight, goalreps) {
  const preplinsTable = {
    100: 1,
    95.5: 2,
    92.2: 3,
    89.2: 4,
    86.3: 5,
    83.7: 6,
    81.1: 7,
    78.6: 8,
    76.2: 9,
    73.9: 10,
    70.7: 11,
    68: 12
  };
  const onerm = oneRmCalc2(weight, reps);
  const entries = Object.entries(preplinsTable);
  let percentageStr;
  for (let i = 0; i < entries.length; i++) {
    if (goalreps < entries[i][1]) {
      percentageStr = entries[i][0];
    }
  }
  let percentage = parseInt(percentageStr) / 100;
  let current = onerm * percentage;
  let goal = oneRmCalc2(goalweight, goalreps) * percentage;
  let progress = current / goal * 100;
  let remainingPercent = 100 - progress;
  let remainingKg = goal - current;
  if (current >= goal) {
    return [true, progress];
  } else {
    return [false, progress, remainingPercent, remainingKg];
  }
}
var action8 = async ({ request, params }) => {
  const form = await request.formData();
  const user = await getUser(request);
  const id = form.get("exercise");
  const weightStr = form.get("weight");
  const repsStr = form.get("reps");
  const weight = parseInt(weightStr);
  const reps = parseInt(repsStr);
  const dateStr2 = form.get("date");
  const date2 = new Date(dateStr2).toISOString();
  const goals = await db.goals.findMany({
    where: { userId: user.id, exerciseId: id }
  });
  const goalweight = goals[0].weight;
  const goalreps = goals[0].reps;
  const goalId = goals[0].id;
  const fields = { weight, reps };
  const fieldErrors = {
    weight: validateweight(weight),
    reps: validatereps(reps)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest6({ fieldErrors, fields });
  }
  const results = goalCalc2(weight, reps, goalweight, goalreps);
  if (results[0] === true) {
    await db.goals.update({
      where: { id: goalId },
      data: {
        achieved: true,
        achievementDate: date2
      }
    });
  }
  const pr = await db.pr.create({
    data: __spreadProps(__spreadValues({}, fields), { userId: user.id, exerciseId: id, date: date2 })
  });
  return (0, import_node11.redirect)(`../dashboard/exercises/${id}`);
};
var findDate = (user) => {
  let userDate = user.createdAt;
  let split = userDate.split("");
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(split[i]);
  }
  const userJoinDate2 = arr.join("");
  const current = new Date();
  const day = current.getDate();
  let date2;
  day < 10 ? date2 = `${current.getFullYear()}-0${current.getMonth() + 1}-0${current.getDate()}` : date2 = `${current.getFullYear()}-0${current.getMonth() + 1}-0${current.getDate()}`;
  const data = [userJoinDate2, date2];
  return data;
};
function newPr2() {
  const data = (0, import_react41.useLoaderData)();
  const exercises = data[0];
  const user = data[1];
  const actionData = (0, import_react41.useActionData)();
  const dateData = findDate(user);
  const userJoinDate2 = dateData[0];
  const date2 = dateData[1];
  return /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(Navbar, {
    data: ["New PR", "prs", "Back"]
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(import_react41.Form, {
    method: "POST",
    className: "mt-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("select", {
    id: "exercise",
    name: "exercise",
    placeholder: "Pick an exercise",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  }, /* @__PURE__ */ React.createElement("option", {
    disabled: true,
    selected: true
  }, "Pick an exercise"), exercises.map((exercise2) => /* @__PURE__ */ React.createElement("option", {
    key: exercise2.id,
    value: exercise2.id
  }, exercise2.title)))), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "weight",
    id: "weight",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "weight",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Weight")), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-10 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "number",
    name: "reps",
    id: "reps",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true
  }), /* @__PURE__ */ React.createElement("label", {
    for: "reps",
    className: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  }, "Reps")), /* @__PURE__ */ React.createElement("div", {
    className: "relative z-0 w-full mb-6 mt-2 group"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "date",
    name: "date",
    id: "date",
    className: "block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    placeholder: " ",
    required: true,
    defaultValue: date2,
    min: userJoinDate2,
    max: date2
  }), /* @__PURE__ */ React.createElement("label", {
    for: "date",
    className: "peer-focus:font-medium absolute mb-2 text-gray-500 text-lg dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 text-left"
  }, "Date")), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }, "Submit"))));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/dashboard/index.jsx
var dashboard_exports = {};
__export(dashboard_exports, {
  ErrorBoundary: () => ErrorBoundary6,
  default: () => dashboard_default,
  getEndOfWeek: () => getEndOfWeek2,
  getSunday: () => getSunday2,
  loader: () => loader15
});
var import_react42 = require("@remix-run/react");
function getSunday2() {
  let sunday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  return sunday;
}
function getEndOfWeek2(d, week) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1) + week;
  return new Date(d.setDate(diff));
}
var loader15 = async ({ request }) => {
  let now = new Date();
  let today2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let lastSunday = new Date(today2.setDate(today2.getDate() - today2.getDay() + 1));
  let thisSunday = new Date(today2.setDate(today2.getDate() - today2.getDay() + 8));
  const user = await getUser(request);
  const exercises = {
    exercises: await db.exercise.findMany({
      where: {
        userId: {
          equals: `${user.id}`
        }
      },
      include: {
        Pr: {
          select: {
            weight: true,
            reps: true
          },
          orderBy: { weight: "desc" }
        }
      },
      orderBy: { updatedAt: "desc" },
      take: 4
    })
  };
  const prs = {
    prs: await db.pr.findMany({
      where: {
        userId: {
          equals: `${user.id}`
        }
      },
      orderBy: { createdAt: "desc" }
    })
  };
  const goals = await db.goals.findMany({
    where: { userId: user.id },
    include: {
      Exercise: {
        select: {
          title: true
        }
      }
    }
  });
  const workouts = {
    workouts: await db.workout.findMany({
      where: {
        userId: {
          equals: `${user.id}`
        },
        date: {
          gt: lastSunday,
          lte: thisSunday
        }
      },
      include: {
        volume: {
          select: {
            date: true,
            exerciseId: true,
            weight: true,
            reps: true,
            sets: true,
            workoutId: true,
            id: true,
            Exercise: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: { date: "desc" }
    })
  };
  const data = { exercises, prs, workouts, goals, user };
  return data;
};
function ErrorBoundary6(error) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(NestedError, null);
}
function ExerciseItems() {
  const data = (0, import_react42.useLoaderData)();
  const workoutData = data.workouts["workouts"];
  const notAchieved = [data.goals, false];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", {
    className: "app-header mb-5"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "app-header-navigation"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "tabs"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "h-auto mb-5 font-bold text-2xl"
  }, "Welcome, ", data.user.name, "!"), /* @__PURE__ */ React.createElement("p", {
    className: ""
  }, "Here's what's happening with your strength progress so far. Well done!"))), /* @__PURE__ */ React.createElement("div", {
    className: "app-header-mobile mb-3"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "mb-2 font-bold text-3xl"
  }, "Welcome, ", data.user.name, "!"), /* @__PURE__ */ React.createElement("p", null, "Here's what's happening with your strength progress so far. Well done!"))), /* @__PURE__ */ React.createElement("div", {
    className: "h-auto mb-10"
  }, /* @__PURE__ */ React.createElement(Navbar2, {
    data: ["My Goals", "goals/new", "goals"]
  }), /* @__PURE__ */ React.createElement(MyGoals, {
    data: notAchieved
  })), /* @__PURE__ */ React.createElement("div", {
    className: "h-auto mb-10 w-full"
  }, /* @__PURE__ */ React.createElement(Navbar2, {
    data: ["My Exercises", "exercises/new", "exercises"]
  }), /* @__PURE__ */ React.createElement(MyExercise, {
    exercises: data.exercises["exercises"]
  })), /* @__PURE__ */ React.createElement("div", {
    className: "h-auto mb-10 flex justify-center flex-col"
  }, /* @__PURE__ */ React.createElement(Navbar2, {
    data: ["My Workouts This Week", "workouts/new", "workouts"]
  }), /* @__PURE__ */ React.createElement(MyWorkouts, {
    data: workoutData
  })));
}
var dashboard_default = ExerciseItems;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/auth/register.jsx
var register_exports = {};
__export(register_exports, {
  action: () => action9,
  default: () => register_default,
  links: () => links2
});
var import_node12 = require("@remix-run/node");
var import_react43 = require("@remix-run/react");

// app/styles/homepage.css
var homepage_default = "/build/_assets/homepage-MM6HWXCP.css";

// route:/Users/ham/hamish/Strength-Tracker/app/routes/auth/register.jsx
var links2 = () => {
  return [
    {
      rel: "stylesheet",
      href: app_default
    },
    {
      rel: "stylesheet",
      href: homepage_default
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Noto Serif"
    }
  ];
};
function badRequest7(data) {
  return (0, import_node12.json)(data, { status: 400 });
}
function validateEmail(email) {
  if (typeof email !== "string" || email.length < 6) {
    return "Email must be at least 7 characters";
  } else if (typeof email !== "string" || email.search(/[@]/) == -1) {
    return "Password must contain atleast 1 @ character";
  } else if (typeof email !== "string" || email.search(/[.]/) == -1) {
    return "Password must contain atleast 1 .";
  }
}
function validatePassword2(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  } else if (typeof password !== "string" || password.search(/[0-9]/) == -1) {
    return "Password must contain atleast 1 number";
  } else if (typeof password !== "string" || password.search(/[A-Z]/) == -1) {
    return "Password must contain atleast 1 upper case letter";
  }
}
var action9 = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const email = form.get("email");
  const password = form.get("password");
  const name = form.get("name");
  const fields = { loginType, email, name, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword2(password)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest7({ fieldErrors, fields });
  }
  const emailExists = await db.user.findFirst({
    where: {
      email
    }
  });
  if (emailExists) {
    return badRequest7({
      fields,
      fieldErrors: { email: `the email address: ${email} already exists.` }
    });
  }
  const user = await register({ email, password, name });
  if (!user) {
    return badRequest7({
      fields,
      formError: "Something went wrong"
    });
  }
  return createUserSession(user.id, "/");
};
function Login() {
  var _a, _b, _c, _d;
  const actionData = (0, import_react43.useActionData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "auth-wrapper"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "flex-1"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "text-center"
  }, /* @__PURE__ */ React.createElement("p", {
    class: "mt-3 text-gray-500 dark:text-black"
  }, "Sign up to start tracking your strength today")), /* @__PURE__ */ React.createElement("div", {
    class: "mt-8"
  }, /* @__PURE__ */ React.createElement("form", {
    method: "POST"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", {
    for: "name",
    class: "block mb-2 text-sm text-black dark:text-black"
  }, "First Name"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "name",
    id: "name",
    htmlFor: "name",
    defaultValue: actionData == null ? void 0 : actionData.fields.name,
    placeholder: "Aphrodite",
    class: "block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "mt-6"
  }, /* @__PURE__ */ React.createElement("label", {
    for: "email",
    class: "block mb-2 text-sm text-black dark:text-black"
  }, "Email Address"), /* @__PURE__ */ React.createElement("input", {
    type: "email",
    name: "email",
    id: "email",
    htmlFor: "email",
    defaultValue: actionData == null ? void 0 : actionData.fields.email,
    placeholder: "example@example.com",
    class: "block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.email) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.email))), /* @__PURE__ */ React.createElement("div", {
    class: "mt-6"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "flex justify-between mb-2"
  }, /* @__PURE__ */ React.createElement("label", {
    for: "password",
    class: "text-sm text-black dark:text-black"
  }, "Password")), /* @__PURE__ */ React.createElement("input", {
    type: "password",
    name: "password",
    id: "password",
    placeholder: "Your Password",
    class: "block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "error"
  }, ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.password) && ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.password))), /* @__PURE__ */ React.createElement("div", {
    class: "mt-6"
  }, /* @__PURE__ */ React.createElement("button", {
    class: "w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
  }, "Sign in"))), /* @__PURE__ */ React.createElement("p", {
    class: "mt-6 text-sm text-center text-gray-400"
  }, "Already have an account?", " ", /* @__PURE__ */ React.createElement(import_react43.Link, {
    to: "../auth/login",
    class: "text-blue-500 focus:outline-none focus:underline hover:underline"
  }, "Login"), ".")))));
}
var register_default = Login;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/auth/logout.jsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action10,
  loader: () => loader16
});
var import_node13 = require("@remix-run/node");
var action10 = async ({ request }) => {
  return logout(request);
};
var loader16 = async () => {
  return (0, import_node13.redirect)("/");
};

// route:/Users/ham/hamish/Strength-Tracker/app/routes/auth/login.jsx
var login_exports = {};
__export(login_exports, {
  action: () => action11,
  default: () => login_default,
  links: () => links3
});
var import_node14 = require("@remix-run/node");
var import_react44 = require("@remix-run/react");
var links3 = () => {
  return [
    {
      rel: "stylesheet",
      href: app_default
    },
    {
      rel: "stylesheet",
      href: homepage_default
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Noto Serif"
    }
  ];
};
function badRequest8(data) {
  return (0, import_node14.json)(data, { status: 400 });
}
function validateEmail2(email) {
  if (typeof email !== "string" || email.length < 3) {
    return "email must be at least 3 characters";
  }
}
function validatePassword3(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  } else if (typeof password !== "string" || password.search(/[0-9]/) == -1) {
    return "Password must contain atleast 1 number";
  } else if (typeof password !== "string" || password.search(/[A-Z]/) == -1) {
    return "Password must contain atleast 1 upper case letter";
  }
}
var action11 = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const email = form.get("email");
  const password = form.get("password");
  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateEmail2(email),
    password: validatePassword3(password)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest8({ fieldErrors, fields });
  }
  const user = await login({ email, password });
  if (!user) {
    return badRequest8({
      fields,
      fieldErrors: { email: "Invalid Credentials" }
    });
  }
  return createUserSession(user.id, "/dashboard");
};
function Login2() {
  var _a, _b, _c, _d;
  const actionData = (0, import_react44.useActionData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "auth-wrapper"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "flex-1"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "text-center"
  }, /* @__PURE__ */ React.createElement("p", {
    class: "mt-3 text-gray-500 dark:text-black"
  }, "Sign in to access your account")), /* @__PURE__ */ React.createElement("div", {
    class: "mt-8"
  }, /* @__PURE__ */ React.createElement("form", {
    method: "POST"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", {
    for: "email",
    class: "block mb-2 text-sm text-black dark:text-black"
  }, "Email Address"), /* @__PURE__ */ React.createElement("input", {
    type: "email",
    name: "email",
    id: "email",
    htmlFor: "email",
    defaultValue: actionData == null ? void 0 : actionData.fields.email,
    placeholder: "example@example.com",
    class: "block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
  }), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.email) && ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.email))), /* @__PURE__ */ React.createElement("div", {
    class: "mt-6"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "flex justify-between mb-2"
  }, /* @__PURE__ */ React.createElement("label", {
    for: "password",
    class: "text-sm text-black dark:text-black"
  }, "Password"), /* @__PURE__ */ React.createElement("a", {
    href: "#",
    class: "text-sm text-black focus:text-blue-500 hover:text-blue-500 hover:underline"
  }, "Forgot password?")), /* @__PURE__ */ React.createElement("input", {
    type: "password",
    name: "password",
    id: "password",
    placeholder: "Your Password",
    class: "block w-full px-4 py-2 mt-2 text-black placeholder-black bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-white dark:text-black dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "error"
  }, ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.password) && ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.password))), /* @__PURE__ */ React.createElement("div", {
    class: "mt-6"
  }, /* @__PURE__ */ React.createElement("button", {
    class: "w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
  }, "Sign in"))), /* @__PURE__ */ React.createElement(import_react44.Link, {
    to: "../auth/register",
    class: "mt-6 text-sm text-center text-gray-400"
  }, "Don't have an account yet?", " ", /* @__PURE__ */ React.createElement("a", {
    href: "#",
    class: "text-blue-500 focus:outline-none focus:underline hover:underline"
  }, "Sign up"), ".")))));
}
var login_default = Login2;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/exercises.jsx
var exercises_exports2 = {};
__export(exercises_exports2, {
  default: () => exercises_default
});
var import_react45 = require("@remix-run/react");
function Exercises() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_react45.Outlet, null));
}
var exercises_default = Exercises;

// route:/Users/ham/hamish/Strength-Tracker/app/routes/index.jsx
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default,
  links: () => links4,
  loader: () => loader17
});
var import_node15 = require("@remix-run/node");
var import_react46 = require("@remix-run/react");

// public/images/feature-1.jpeg
var feature_1_default = "/build/_assets/feature-1-V7IPJR5T.jpeg";

// public/images/feature-2.jpeg
var feature_2_default = "/build/_assets/feature-2-COWHGQHU.jpeg";

// public/images/feature-3.jpeg
var feature_3_default = "/build/_assets/feature-3-CWDE334X.jpeg";

// app/components/homepage/Feature.jsx
var Feature = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "max-w-xl mb-6 sm:mx-auto sm:text-center md:mb-10 lg:max-w-2xl"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "mb-1 text-lg font-semibold tracking-wide uppercase md:mb-2"
  }, "Get started today"), /* @__PURE__ */ React.createElement("p", {
    className: "text-base text-gray-700 md:text-lg"
  }, "Strength Tracker makes your Strength journey simple and fun.")), /* @__PURE__ */ React.createElement("div", {
    className: "grid gap-6 row-gap-5 lg:grid-cols-3"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("img", {
    className: "object-cover w-full h-64 mb-6 rounded shadow-lg lg:h-80 xl:h-96",
    src: feature_1_default,
    alt: ""
  }), /* @__PURE__ */ React.createElement("h5", {
    className: "mb-2 text-xl font-bold leading-none sm:text-2xl"
  }, "Achieve your goals"), /* @__PURE__ */ React.createElement("p", {
    className: "text-gray-700"
  }, "Starting a new workout routine or training program? Strength Tracker will help users set their goals from the start, so they can see how much progress they've made as they work towards them.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("img", {
    className: "object-cover w-full h-64 mb-6 rounded shadow-lg lg:h-80 xl:h-96",
    src: feature_2_default,
    alt: ""
  }), /* @__PURE__ */ React.createElement("h5", {
    className: "mb-2 text-xl font-bold leading-none sm:text-2xl"
  }, "Easy to use"), /* @__PURE__ */ React.createElement("p", {
    className: "text-gray-700"
  }, "No need to dig through your phone for the notes you took at the gym. We\u2019ve got a simple, intuitive design that makes tracking your progress easy and fun.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("img", {
    className: "object-cover w-full h-64 mb-6 rounded shadow-lg lg:h-80 xl:h-96",
    src: feature_3_default,
    alt: ""
  }), /* @__PURE__ */ React.createElement("h5", {
    className: "mb-2 text-xl font-bold leading-none sm:text-2xl"
  }, "Track your progess"), /* @__PURE__ */ React.createElement("p", {
    className: "text-gray-700"
  }, "Gain clarity on which exercises are most efficient, track a variety of statistics (i.e., sets, reps, weight), set and track personal records."))));
};

// public/images/hero-img.jpeg
var hero_img_default = "/build/_assets/hero-img-5HOINKLH.jpeg";

// app/components/homepage/HeroSection.jsx
function HeroSection() {
  return /* @__PURE__ */ React.createElement("section", {
    class: "text-gray-600 body-font w-full"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "container mx-auto flex py-24 md:flex-row flex-col items-center w-full"
  }, /* @__PURE__ */ React.createElement("div", {
    class: "lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
  }, /* @__PURE__ */ React.createElement("h1", {
    class: "title-font sm:text-6xl text-4xl mb-4 font-black text-gray-900 italic"
  }, "Measure progress"), /* @__PURE__ */ React.createElement("p", {
    class: "mb-8 leading-relaxed text-xl"
  }, "Stay on track with your fitness goals. Create a profile and track your strength progress to meet individual goals and challenges."), /* @__PURE__ */ React.createElement("div", {
    class: "flex justify-center"
  }, /* @__PURE__ */ React.createElement("button", {
    class: "inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
  }, "Register"), /* @__PURE__ */ React.createElement("button", {
    class: "ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
  }, "Login"))), /* @__PURE__ */ React.createElement("div", {
    class: "lg:max-w-lg lg:w-full md:w-1/2 w-5/6"
  }, /* @__PURE__ */ React.createElement("img", {
    class: "object-cover object-center rounded",
    alt: "hero",
    src: hero_img_default
  }))));
}

// route:/Users/ham/hamish/Strength-Tracker/app/routes/index.jsx
var links4 = () => {
  return [
    {
      rel: "stylesheet",
      href: app_default
    },
    {
      rel: "stylesheet",
      href: homepage_default
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Noto Serif"
    }
  ];
};
var loader17 = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    user
  };
  if (user) {
    return (0, import_node15.redirect)("/dashboard");
  }
  return data;
};
function Home() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "layout"
  }, /* @__PURE__ */ React.createElement(HeroSection, null), /* @__PURE__ */ React.createElement(Feature, null));
}
var routes_default = Home;

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "54039b58", "entry": { "module": "/build/entry.client-5BYLSRVJ.js", "imports": ["/build/_shared/chunk-3XXAVSMV.js", "/build/_shared/chunk-XGX5MSUA.js", "/build/_shared/chunk-QO3FLZQJ.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-5EZG3GFI.js", "imports": ["/build/_shared/chunk-DT4UPYIM.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/auth/login": { "id": "routes/auth/login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/auth/login-HYPMAGJ3.js", "imports": ["/build/_shared/chunk-ZEZWO6LP.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/auth/logout": { "id": "routes/auth/logout", "parentId": "root", "path": "auth/logout", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/auth/logout-KMNH7DVE.js", "imports": void 0, "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/auth/register": { "id": "routes/auth/register", "parentId": "root", "path": "auth/register", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/auth/register-ZQITHGQD.js", "imports": ["/build/_shared/chunk-ZEZWO6LP.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/$userId.profile": { "id": "routes/dashboard/$userId.profile", "parentId": "root", "path": "dashboard/:userId/profile", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/$userId.profile-A76VD2GF.js", "imports": ["/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/exercises/$exerciseId": { "id": "routes/dashboard/exercises/$exerciseId", "parentId": "root", "path": "dashboard/exercises/:exerciseId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/exercises/$exerciseId-LQISXWYQ.js", "imports": ["/build/_shared/chunk-M2KFHSS7.js", "/build/_shared/chunk-CATU4WDA.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/exercises/$exerciseId.$pr": { "id": "routes/dashboard/exercises/$exerciseId.$pr", "parentId": "root", "path": "dashboard/exercises/:exerciseId/:pr", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/exercises/$exerciseId.$pr-72MBCCB4.js", "imports": ["/build/_shared/chunk-M2KFHSS7.js", "/build/_shared/chunk-CATU4WDA.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/exercises/$exerciseId.pr-new": { "id": "routes/dashboard/exercises/$exerciseId.pr-new", "parentId": "root", "path": "dashboard/exercises/:exerciseId/pr-new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/exercises/$exerciseId.pr-new-OQJKGH5Q.js", "imports": ["/build/_shared/chunk-PCTWQU6K.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/exercises/$exerciseId.volume": { "id": "routes/dashboard/exercises/$exerciseId.volume", "parentId": "root", "path": "dashboard/exercises/:exerciseId/volume", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/exercises/$exerciseId.volume-QTHHMVHW.js", "imports": ["/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/exercises/index": { "id": "routes/dashboard/exercises/index", "parentId": "root", "path": "dashboard/exercises", "index": true, "caseSensitive": void 0, "module": "/build/routes/dashboard/exercises/index-KROIYQKH.js", "imports": ["/build/_shared/chunk-K55B43RF.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/dashboard/exercises/new": { "id": "routes/dashboard/exercises/new", "parentId": "root", "path": "dashboard/exercises/new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/exercises/new-MXZN5IG7.js", "imports": ["/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/goals/index": { "id": "routes/dashboard/goals/index", "parentId": "root", "path": "dashboard/goals", "index": true, "caseSensitive": void 0, "module": "/build/routes/dashboard/goals/index-45I5DUXD.js", "imports": ["/build/_shared/chunk-DQV2W2H7.js", "/build/_shared/chunk-4W7N2FDS.js", "/build/_shared/chunk-OJK6LEMC.js", "/build/_shared/chunk-6DSFSQYV.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/dashboard/goals/new": { "id": "routes/dashboard/goals/new", "parentId": "root", "path": "dashboard/goals/new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/goals/new-GPCDDGL6.js", "imports": ["/build/_shared/chunk-DQV2W2H7.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/index": { "id": "routes/dashboard/index", "parentId": "root", "path": "dashboard", "index": true, "caseSensitive": void 0, "module": "/build/routes/dashboard/index-7DS6OUVO.js", "imports": ["/build/_shared/chunk-EXEJX4RO.js", "/build/_shared/chunk-K55B43RF.js", "/build/_shared/chunk-6DSFSQYV.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-CATU4WDA.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/dashboard/prs/index": { "id": "routes/dashboard/prs/index", "parentId": "root", "path": "dashboard/prs", "index": true, "caseSensitive": void 0, "module": "/build/routes/dashboard/prs/index-XP43DCRW.js", "imports": ["/build/_shared/chunk-4W7N2FDS.js", "/build/_shared/chunk-OJK6LEMC.js", "/build/_shared/chunk-6DSFSQYV.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/dashboard/prs/new": { "id": "routes/dashboard/prs/new", "parentId": "root", "path": "dashboard/prs/new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/prs/new-LNKDZSQS.js", "imports": ["/build/_shared/chunk-PCTWQU6K.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/volume/index": { "id": "routes/dashboard/volume/index", "parentId": "root", "path": "dashboard/volume", "index": true, "caseSensitive": void 0, "module": "/build/routes/dashboard/volume/index-IZNL4QTV.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/workouts/$workoutId": { "id": "routes/dashboard/workouts/$workoutId", "parentId": "root", "path": "dashboard/workouts/:workoutId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/workouts/$workoutId-5M2RIGTN.js", "imports": ["/build/_shared/chunk-EXEJX4RO.js", "/build/_shared/chunk-K55B43RF.js", "/build/_shared/chunk-OJK6LEMC.js", "/build/_shared/chunk-6DSFSQYV.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-CATU4WDA.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/dashboard/workouts/index": { "id": "routes/dashboard/workouts/index", "parentId": "root", "path": "dashboard/workouts", "index": true, "caseSensitive": void 0, "module": "/build/routes/dashboard/workouts/index-NAVKMCBY.js", "imports": ["/build/_shared/chunk-EXEJX4RO.js", "/build/_shared/chunk-K55B43RF.js", "/build/_shared/chunk-6DSFSQYV.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-CATU4WDA.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/dashboard/workouts/new": { "id": "routes/dashboard/workouts/new", "parentId": "root", "path": "dashboard/workouts/new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/dashboard/workouts/new-M46CMWFM.js", "imports": ["/build/_shared/chunk-4W7N2FDS.js", "/build/_shared/chunk-PCTWQU6K.js", "/build/_shared/chunk-OJK6LEMC.js", "/build/_shared/chunk-6DSFSQYV.js", "/build/_shared/chunk-A3LBTVSX.js", "/build/_shared/chunk-5LEHBJPN.js", "/build/_shared/chunk-KZ7PACYQ.js", "/build/_shared/chunk-C2HSWUHS.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/exercises": { "id": "routes/exercises", "parentId": "root", "path": "exercises", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/exercises-WG5FMJVC.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-ENA4256T.js", "imports": ["/build/_shared/chunk-ZEZWO6LP.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false } }, "url": "/build/manifest-54039B58.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/dashboard/exercises/$exerciseId.pr-new": {
    id: "routes/dashboard/exercises/$exerciseId.pr-new",
    parentId: "root",
    path: "dashboard/exercises/:exerciseId/pr-new",
    index: void 0,
    caseSensitive: void 0,
    module: exerciseId_pr_new_exports
  },
  "routes/dashboard/exercises/$exerciseId.volume": {
    id: "routes/dashboard/exercises/$exerciseId.volume",
    parentId: "root",
    path: "dashboard/exercises/:exerciseId/volume",
    index: void 0,
    caseSensitive: void 0,
    module: exerciseId_volume_exports
  },
  "routes/dashboard/exercises/$exerciseId.$pr": {
    id: "routes/dashboard/exercises/$exerciseId.$pr",
    parentId: "root",
    path: "dashboard/exercises/:exerciseId/:pr",
    index: void 0,
    caseSensitive: void 0,
    module: exerciseId_pr_exports
  },
  "routes/dashboard/exercises/$exerciseId": {
    id: "routes/dashboard/exercises/$exerciseId",
    parentId: "root",
    path: "dashboard/exercises/:exerciseId",
    index: void 0,
    caseSensitive: void 0,
    module: exerciseId_exports
  },
  "routes/dashboard/workouts/$workoutId": {
    id: "routes/dashboard/workouts/$workoutId",
    parentId: "root",
    path: "dashboard/workouts/:workoutId",
    index: void 0,
    caseSensitive: void 0,
    module: workoutId_exports
  },
  "routes/dashboard/$userId.profile": {
    id: "routes/dashboard/$userId.profile",
    parentId: "root",
    path: "dashboard/:userId/profile",
    index: void 0,
    caseSensitive: void 0,
    module: userId_profile_exports
  },
  "routes/dashboard/exercises/index": {
    id: "routes/dashboard/exercises/index",
    parentId: "root",
    path: "dashboard/exercises",
    index: true,
    caseSensitive: void 0,
    module: exercises_exports
  },
  "routes/dashboard/workouts/index": {
    id: "routes/dashboard/workouts/index",
    parentId: "root",
    path: "dashboard/workouts",
    index: true,
    caseSensitive: void 0,
    module: workouts_exports
  },
  "routes/dashboard/exercises/new": {
    id: "routes/dashboard/exercises/new",
    parentId: "root",
    path: "dashboard/exercises/new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/dashboard/volume/index": {
    id: "routes/dashboard/volume/index",
    parentId: "root",
    path: "dashboard/volume",
    index: true,
    caseSensitive: void 0,
    module: volume_exports
  },
  "routes/dashboard/workouts/new": {
    id: "routes/dashboard/workouts/new",
    parentId: "root",
    path: "dashboard/workouts/new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports2
  },
  "routes/dashboard/goals/index": {
    id: "routes/dashboard/goals/index",
    parentId: "root",
    path: "dashboard/goals",
    index: true,
    caseSensitive: void 0,
    module: goals_exports
  },
  "routes/dashboard/goals/new": {
    id: "routes/dashboard/goals/new",
    parentId: "root",
    path: "dashboard/goals/new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports3
  },
  "routes/dashboard/prs/index": {
    id: "routes/dashboard/prs/index",
    parentId: "root",
    path: "dashboard/prs",
    index: true,
    caseSensitive: void 0,
    module: prs_exports
  },
  "routes/dashboard/prs/new": {
    id: "routes/dashboard/prs/new",
    parentId: "root",
    path: "dashboard/prs/new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports4
  },
  "routes/dashboard/index": {
    id: "routes/dashboard/index",
    parentId: "root",
    path: "dashboard",
    index: true,
    caseSensitive: void 0,
    module: dashboard_exports
  },
  "routes/auth/register": {
    id: "routes/auth/register",
    parentId: "root",
    path: "auth/register",
    index: void 0,
    caseSensitive: void 0,
    module: register_exports
  },
  "routes/auth/logout": {
    id: "routes/auth/logout",
    parentId: "root",
    path: "auth/logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/auth/login": {
    id: "routes/auth/login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/exercises": {
    id: "routes/exercises",
    parentId: "root",
    path: "exercises",
    index: void 0,
    caseSensitive: void 0,
    module: exercises_exports2
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};

// server.js
function getLoadContext(event, context) {
  let rawAuthorizationString;
  let netlifyGraphToken;
  if (event.authlifyToken != null) {
    netlifyGraphToken = event.authlifyToken;
  }
  let authHeader = event.headers["authorization"];
  let graphSignatureHeader = event.headers["x-netlify-graph-signature"];
  if (authHeader != null && /Bearer /gi.test(authHeader)) {
    rawAuthorizationString = authHeader.split(" ")[1];
  }
  let loadContext = {
    clientNetlifyGraphAccessToken: rawAuthorizationString,
    netlifyGraphToken,
    netlifyGraphSignature: graphSignatureHeader
  };
  Object.keys(loadContext).forEach((key) => {
    if (loadContext[key] == null) {
      delete loadContext[key];
    }
  });
  return loadContext;
}
var handler = (0, import_netlify.createRequestHandler)({
  build: server_build_exports,
  getLoadContext,
  mode: "development"
});
module.exports = __toCommonJS(server_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=server.js.map
