const USERS_KEY = "mvp_livros_users";
const SESSION_KEY = "mvp_livros_session";

const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const feedback = document.getElementById("auth-feedback");

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setFeedback(message) {
    if (feedback) {
        feedback.textContent = message;
    }
}

function switchTab(mode) {
    const isLogin = mode === "login";
    if (tabLogin) tabLogin.classList.toggle("active", isLogin);
    if (tabRegister) tabRegister.classList.toggle("active", !isLogin);
    if (loginForm) loginForm.classList.toggle("active", isLogin);
    if (registerForm) registerForm.classList.toggle("active", !isLogin);
    setFeedback("");
}

function irParaEstante() {
    window.location.href = "index.html";
}

if (tabLogin) {
    tabLogin.addEventListener("click", () => switchTab("login"));
}

if (tabRegister) {
    tabRegister.addEventListener("click", () => switchTab("register"));
}

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        try {
            const name = (document.getElementById("reg-name")?.value || "").trim();
            const email = (document.getElementById("reg-email")?.value || "").trim().toLowerCase();
            const password = document.getElementById("reg-password")?.value || "";

            if (!name || !email || !password) {
                setFeedback("Preencha todos os campos.");
                return;
            }

            const users = getUsers();
            if (users.some((u) => u.email === email)) {
                setFeedback("Este e-mail já está cadastrado.");
                return;
            }

            const newUser = {
                id: String(Date.now()),
                name,
                email,
                password
            };

            users.push(newUser);
            saveUsers(users);

            const sessionData = { id: newUser.id, name: newUser.name, email: newUser.email };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            localStorage.setItem("usuarioLogado", JSON.stringify(sessionData));

            irParaEstante();
        } catch (err) {
            console.error(err);
            setFeedback("Erro ao cadastrar. Veja o console.");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        try {
            const email = (document.getElementById("login-email")?.value || "").trim().toLowerCase();
            const password = document.getElementById("login-password")?.value || "";

            const users = getUsers();
            const user = users.find((u) => u.email === email && u.password === password);

            if (!user) {
                setFeedback("E-mail ou senha incorretos.");
                return;
            }

            const sessionData = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            localStorage.setItem("usuarioLogado", JSON.stringify(sessionData));

            irParaEstante();
        } catch (err) {
            console.error(err);
            setFeedback("Erro ao entrar. Veja o console.");
        }
    });
}

switchTab("login");