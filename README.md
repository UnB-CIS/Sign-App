<div align="center">

<img style="width:250px; height: 90px " src="https://cis.ieee.org/images/files/Branding/logos/white/IEEE_CIS_logo_White_RGB_300ppi.png" />

# Sign App

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/seu-usuario/sign-app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://claude.ai/chat/LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?logo=react)](https://reactnative.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-339933.svg?logo=node.js)](https://nodejs.org/)

</div>

Repositório principal do app **Sign** desenvolvido pelo IEEE Computational Intelligence Society
### Sumário

* [Pré-requisitos](#pré-requisitos)
* [Como Rodar o Projeto](#como-rodar-o-projeto)
* [O que o Script de Automação Faz?](#dentro-dos-entrypoints)
* [Solução de Problemas (Troubleshooting)](#solução-de-problemas-troubleshooting)


### Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas e configuradas em sua máquina:

  * [**Git**](https://git-scm.com/downloads)
  * [**Node.js >= 20**](https://nodejs.org/) — recomendado via [nvm](https://github.com/nvm-sh/nvm)
  * [**Android Studio + Android SDK**](https://developer.android.com/studio) com pelo menos um Emulador (AVD) criado
  * **watchman** (Linux/macOS) — necessário para o Hot Reload funcionar corretamente:

    ```bash
    # Ubuntu/Debian
    sudo apt-get install -y watchman
    # macOS
    brew install watchman
    ```

**IMPORTANTE:** Após instalar o Android SDK, é necessário configurar a variável de ambiente `ANDROID_HOME` apontando para o diretório do SDK.

* [Tutorial de instalação e configuração do Android Studio e AVD Manager](https://youtu.be/XfJj6EQZfAc)

### Como Rodar o Projeto

Com o ambiente devidamente configurado,

#### Passo 1: Clone o Repositório

```bash
git clone https://github.com/UnB-CIS/Sign-App.git
cd Sign-App
```

#### Passo 2: Execute o Script de Automação

Escolha o comando correspondente ao seu sistema operacional. O comando cobrirá desde a instalação de dependências dentro do Docker até a inicialização do app.

##### 🐧 Para Linux ou macOS no **Emulador**:

```bash
npm install
ANDROID_HOME="/home/$(whoami)/Android/Sdk" npm run dev:start:unix
```

##### 🐧 Para Linux ou macOS no Dispositivo USB:

```bash
npm install
ANDROID_HOME="/home/$(whoami)/Android/Sdk" npm run dev:start:unixdevice
```

##### 💻 Para Windows (usando CMD ou PowerShell) no **Emulador**:

```bash
npm install
npm run dev:start:win
```

E **pronto**, suas alterações no código serão refletidas automaticamente no emulador (Hot Reload).

### Dentro dos entrypoints

O comando `npm run dev:start:*` executa uma série de passos para criar um ambiente de desenvolvimento completo e funcional:

1. Verifica se a variável de ambiente `ANDROID_HOME` está configurada.
2. Inicia o **Metro Bundler diretamente no host** (na porta 8081) com reset de cache.
3. Aguarda a porta 8081 ficar disponível.
4. Inicia o emulador Android (AVD) automaticamente em segundo plano *(modo emulador)* ou aguarda um dispositivo USB *(modo device)*.
5. Aguarda o sistema operacional do emulador carregar por completo.
6. Configura o `adb reverse tcp:8081 tcp:8081`, permitindo que o app no emulador se comunique com o Metro no host.
7. Compila o app via Gradle (`assembleDebug`) e instala no dispositivo (`installDebug`).
8. Inicia o aplicativo automaticamente.

### Solução de Problemas (Troubleshooting)

1. **Erro: `A variável de ambiente ANDROID_HOME não está definida.`**

   * **Solução:** Crie a variável de ambiente `ANDROID_HOME` apontando para a pasta do Android SDK (normalmente `~/Android/Sdk` no Linux/macOS). Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

     ```bash
     export ANDROID_HOME="$HOME/Android/Sdk"
     export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
     ```

2. **Erro: `Nenhum emulador (AVD) encontrado.`**

   * **Solução:** Crie um dispositivo virtual pelo AVD Manager no Android Studio ou via linha de comando:

     ```bash
     avdmanager create avd -n MeuEmulador -k "system-images;android-34;google_apis;x86_64"
     ```

3. **O comando `adb` não foi encontrado.**

   * **Solução:** O `adb` fica em `$ANDROID_HOME/platform-tools`. Certifique-se de que esse caminho está no seu `PATH` (veja item 1).

4. **Hot Reload não funciona (alterações no código não refletem no emulador).**

   * **Solução:** Certifique-se de que o **watchman** está instalado (`watchman --version`). Sem ele, o Metro usa um watcher menos eficiente que pode não detectar mudanças de arquivos corretamente no Linux.

5. **Erro de versão do Node.js.**

   * **Solução:** O projeto requer Node.js >= 20. Use o [nvm](https://github.com/nvm-sh/nvm) para gerenciar versões:

     ```bash
     nvm install 20
     nvm use 20
     ```

6. **A porta 8081 já está em uso.**

   * **Solução:** Encerre o processo que está ocupando a porta e tente novamente:

     ```bash
     fuser -k 8081/tcp
     ```

