const url = "https://api.github.com/users/";
let users = [];
//requisição de usuário
async function fetchUser(name) {
    try {
        const response = await fetch(`${url}${name}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err.message);
    }
}
//criando usuario apartir da requisição
async function createUser(username) {
    const user = await fetchUser(username);
    if (user.id) {
        const newUser = {
            id: user.id,
            login: user.login,
            name: user.name,
            bio: user.bio,
            public_repos: user.public_repos,
            repos_url: user.repos_url,
            repos: [],
        };
        users.push(newUser);
        return newUser;
    }
    else {
        console.log(user.message);
    }
}
//requisição repositórios
async function fetchRepos(username) {
    const user = users.find((user) => user.login === username);
    if (!user) {
        console.log("Usuário não encontrado");
    }
    else {
        const request = await fetch(user.repos_url);
        const response = await request.json();
        response.forEach((r) => {
            const respository = {
                name: r.name,
                description: r.description,
                stargazers_count: r.stargazers_count,
                fork: r.fork,
            };
            user.repos.push(respository);
        });
    }
}
//mostrar respositórios de um usuário salvo
function showRepositories(user) {
    console.log(`Veja 5 respositórios de ${user.name}`);
    for (let i = 0; i <= 5; i++) {
        console.log(`
            Nome do repositório: ${user.repos[i].name}
            Descrição: ${user.repos[i].description}
            Estrelas: ${user.repos[i].stargazers_count}
            É um fork: ${user.repos[i].fork}
            `);
    }
}
//mostrar todos os usuários salvos
function showAllUsers() {
    const message = "Usuários:\n";
    console.log(message);
    users.forEach((user) => {
        console.log(`Nome: ${user.name} | Id: ${user.id} | Repositórios: ${user.public_repos}`);
    });
}
//calcular soma de repositorios de todos os usuários (juntos)
function getAllRepositories() {
    const repos = users.reduce((accum, user) => accum + user.public_repos, 0);
    console.log(`Total de repositórios ${repos}`);
}
//mostrar os cinco usuarios com mais repositorios
async function getUsersMostRepos() {
    // Ordena o array de usuários com base no número de repositórios em ordem decrescente
    const sortedUsers = users.sort((a, b) => b.public_repos - a.public_repos);
    // Retorna os cinco primeiros usuários do array ordenado
    const top5 = sortedUsers.slice(0, 3).forEach((user, index) => console.log(`${index + 1}°: ${user.name}
        Repositórios: ${user.public_repos}`));
}
//testando o codigo
async function main() {
    const marianna = await createUser("marianna-regio");
    await fetchRepos("marianna-regio");
    const isaac = await createUser("isaacpontes");
    await fetchRepos("isaacpontes");
    const juliana = await createUser("julianaconde");
    await fetchRepos("julianaconde");
    //showRepositories(isaac);
    getAllRepositories();
    showAllUsers();
    getUsersMostRepos();
}
main();
