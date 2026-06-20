# 📦 Estoque Inteligente de Medicamentos

Um aplicativo móvel desenvolvido em **React Native** com **Expo** e integrado ao **Firebase (Authentication & Firestore)** para o controle e gerenciamento automatizado do estoque de medicamentos em unidades de saúde.

---

## 👥 Integrantes do Grupo
- **Alice Miranda**
- **João Gustavo**

---

## 🚀 Funcionalidades do Projeto

### 🔐 1. Autenticação e Cadastro de Usuários
- **Cadastro:** Criação de novas contas com validação de e-mail e senha diretamente no *Firebase Authentication*.
- **Login:** Sistema seguro de acesso que redireciona o usuário autenticado para as telas internas do aplicativo.

### 👤 2. Perfil do Usuário (CRUD Completo)
- **Create/Read:** Visualização dos dados cadastrados (E-mail de acesso, Nome Completo e Telefone).
- **Update:** Permite a edição e salvamento do nome e telefone do usuário em tempo real.
- **Delete:** Funcionalidade exclusiva para a exclusão definitiva da conta do usuário do sistema.

### 💊 3. Controle de Estoque (CRUD Completo & Semente Inteligente)
- **Visualização (Read):** Lista organizada automaticamente em ordem alfabética (de A a Z) para facilitar a busca por medicamentos.
- **Inclusão Manual (Create):** Formulário simples para adicionar um novo medicamento informando o nome e a quantidade inicial.
- **Atualização de Saldo (Update):** Botões rápidos de `+` e `-` para incrementar ou decrementar a quantidade em estoque instantaneamente (com trava de segurança para impedir estoque negativo).
- **Remoção (Delete):** Botão de exclusão (lixeira) com alerta de confirmação para remover o medicamento permanentemente do banco de dados.
- **🌱 Carregar Lista Padrão (Seeding Inteligente):** Botão especial que popula o banco de dados com uma lista dos 7 medicamentos mais comuns da saúde pública. Conta com uma regra de negócio que utiliza o identificador único por nome, garantindo que mesmo clicando múltiplas vezes, os dados **nunca sejam duplicados**.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** React Native & Expo
- **Linguagem:** JavaScript (ES6+)
- **Banco de Dados & Auth:** Firebase (Firestore Database & Firebase Auth)
- **Estilização:** StyleSheet nativo com ícones da biblioteca `@expo/vector-icons` (*MaterialCommunityIcons*)
- **Navegação:** React Navigation Stack

---

## 📂 Estrutura do Repositório

```text
├── App.js                 # Arquivo principal (Configuração das Rotas de Navegação)
├── package.json           # Dependências e scripts do projeto
├── README.md              # Documentação do projeto
│
├── config/
│   └── firebase.js        # Inicialização e credenciais do Firebase
│
└── screens/
    ├── LoginScreen.js     # Tela de Autenticação
    ├── RegisterScreen.js  # Tela de Criação de Contas
    ├── ProfileScreen.js   # Tela de Perfil do Usuário (CRUD Perfil)
    └── InventoryScreen.js # Tela de Estoque de Medicamentos (CRUD Estoque)
