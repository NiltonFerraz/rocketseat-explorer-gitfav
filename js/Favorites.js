import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('maykbrito')
        .then(user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        // console.log(username)
        try {
            const userExists = this.entries.find(entry => entry.login === username)

            console.log(userExists)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            // console.log(user)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        // Higher-order functions (map, filter, find, reduce)
        const filteredeEntries = this.entries
            .filter( entry => entry.login !== user.login )
        
            this.entries = filteredeEntries
            this.update()
            this.save()
    }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
        // console.log(this.root)
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            // console.log(row)
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/niltonferraz.png" alt="Imagem de Nilton Ferraz">
                <a href="https://github.com/niltonferraz">
                    <p>Nilton Ferraz</p>
                    <span>nilferraz</span>
                </a>
            </td>
            <td class="repositories">
                46
            </td>
            <td class="followers">
                2
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `
        return tr
    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}