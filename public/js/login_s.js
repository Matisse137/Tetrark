import ky from 'ky';

/**
 * 1. CONFIGURATION CLIENT API (Ky)
 * Ce client sera utilisé pour toutes tes requêtes vers le serveur.
 */
const api = ky.create({
	prefixUrl: window.location.origin,
	hooks: {
		beforeRequest: [
			request => {
				const token = localStorage.getItem('auth_token');
				if (token) {
					[cite_start]// Injection automatique du token pour toutes les requêtes [cite: 13]
					request.headers.set('Authorization', `Bearer ${token}`);
				}
			}
		],
		afterResponse: [
			async (request, options, response) => {
				// Si le serveur renvoie 401, on considère que le token est mort
				if (response.status === 401) {
					logout_process();
				}
			}
		]
	}
});

/**
 * 2. GESTION DU THÈME
 * On le met sur 'window' pour que ton onclick="change_theme()" fonctionne.
 */
window.change_theme = function(theme_name) {
	document.documentElement.setAttribute('data-theme', theme_name);
	localStorage.setItem('user_theme', theme_name);
};

/**
 * 3. LOGIQUE DE DÉCONNEXION
 */
function logout_process()
{
	localStorage.removeItem('auth_token');
	window.location.href = '/login';
}

/**
 * 4. INITIALISATION AU CHARGEMENT DU DOM
 */
document.addEventListener('DOMContentLoaded', () => {
	// A. Appliquer le thème au démarrage
	const saved_theme = localStorage.getItem('user_theme');
	if (saved_theme) document.documentElement.setAttribute('data-theme', saved_theme);

	// B. Gérer le formulaire de login (s'il est présent sur la page)
	const loginForm = document.querySelector(".login_frame");
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();

			[cite_start]// On récupère les données (email/password) [cite: 14]
			const formData = new FormData(loginForm);
			const jsonData = Object.fromEntries(formData.entries());

			try {
				[cite_start]// Envoi en POST comme préconisé [cite: 13, 25]
				const res = await api.post('login', { json: jsonData }).json();
				if (res.token) {
					localStorage.setItem('auth_token', res.token);
					window.location.href = '/';
				}
			} catch (err) {
				console.error("Erreur de connexion");
				alert("Identifiants incorrects.");
			}
		});
	}

	// C. Gérer le lien Logout du header
	const logoutLink = document.querySelector('a[href="/logout"]');
	if (logoutLink) {
		logoutLink.addEventListener('click', (e) => {
			e.preventDefault();
			logout_process();
		});
	}
});

export default api;