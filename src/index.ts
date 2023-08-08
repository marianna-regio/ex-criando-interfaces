const url = "https://api.github.com/users/";
let users: GitHubUser[] = [];

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  repos_url: string;
  repos: GitHubUserRepos[];
}

interface GitHubUserRepos {
  name: string;
  description: string;
  fork: boolean;
  stargazers_count: number;
}

//requisição de usuário
async function fetchUser(name: string) {
  try {
    const response = await fetch(`${url}${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

//criando usuario apartir da requisição
async function createUser(username: string) {
  const user = await fetchUser(username);
  if (user.id) {
    const newUser: GitHubUser = {
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
  } else {
    console.log(user.message);
  }
}

//requisição repositórios
async function fetchRepos(username: string) {
  const user = users.find((user) => user.login === username);

  if (!user) {
    console.log("Usuário não encontrado");
  } else {
    const request = await fetch(user.repos_url);
    const response: GitHubUserRepos[] = await request.json();
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

//mostrar 5 respositórios de um usuário salvo
function showRepositories(user: GitHubUser) {
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
    console.log(
      `Nome: ${user.name} | Id: ${user.id} | Repositórios: ${user.public_repos}`
    );
  });
}

//calcular soma de repositorios de todos os usuários (juntos)
function getAllRepositories() {
  const repos = users.reduce((accum, user) => accum + user.public_repos, 0);
  console.log(`Total de repositórios ${repos}`);
}

//mostrar os tres usuarios com mais repositorios
async function getUsersMostRepos() {
  // Ordena o array de usuários com base no número de repositórios em ordem decrescente
  const sortedUsers = users.sort((a, b) => b.public_repos - a.public_repos);
  // Retorna os tres primeiros usuários do array ordenado
  const top5 = sortedUsers.slice(0, 3).forEach((user,index) =>
    console.log(`${index+1}°: ${user.name}
        Repositórios: ${user.public_repos}`)
  );
}

//testando o codigo
async function main() {
  const marianna: GitHubUser = await createUser("marianna-regio");
  await fetchRepos("marianna-regio");

  const isaac: GitHubUser = await createUser("isaacpontes");
  await fetchRepos("isaacpontes");

  const juliana: GitHubUser = await createUser("julianaconde")
  await fetchRepos("julianaconde");

  //showRepositories(isaac);
  getAllRepositories();
  showAllUsers();
  getUsersMostRepos();
}

main();
