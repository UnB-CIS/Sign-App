# Sign-App

### 🔹 Frontend
Opções avaliadas: **React Native** e **Android Studio (Java/Kotlin)**.  

- **React Native**  
  - Framework baseado em React para desenvolvimento mobile multiplataforma (iOS e Android).  
  - Reutilização de código entre plataformas.  
  - Ecossistema rico em bibliotecas e comunidade ativa.
  - Experiência prévia dos desenvolvedores 

- **Android Studio (Java/Kotlin)**  
  - IDE oficial para desenvolvimento Android.  
  - Integração completa com recursos nativos do Android.  
  - Indicado para demandas de alto desempenho e uso intensivo de APIs nativas.
  - facilidade na configuração

A opção melhor agora é o React-Native. 

---

### 🔹 Backend
- **Firebase** (serverless e gerenciado pelo Google)  
  - **Authentication**: autenticação de usuários via email/senha, Google, Facebook e outros provedores.  
  - **Cloud Firestore**: banco de dados **NoSQL**, em tempo real e escalável.  
  - **Cloud Storage**: armazenamento de arquivos (imagens, vídeos, documentos). Esse serviço precisa está no plano pago.
- **problema**: armazena 5gb em cloud storage e armazena 1 gb no cloud firestore
Mesmo com esses problemas, a simplicidade na autenticação ainda faz valer a pena. E para o MVP, ainda dá para ser usado.

---

### 🔹 Banco de Dados
- **Cloud Firestore (NoSQL)**  
  - Banco de dados não relacional, baseado em documentos.  
  - Sincronização em tempo real entre usuários e dispositivos.  
  - Escalabilidade automática e integrada ao ecossistema Firebase.  

---

### 🔹 Ferramentas Auxiliares
- **Autenticação**: Firebase Authentication.  
- **Testes**:  
  - Jest (para React Native).  
  - JUnit (para Android Studio).
  - emuladores do android studio
- **CI/CD**: GitHub Actions ou GitLab CI para integração contínua.   
- **Push Notifications**: Firebase Cloud Messaging (FCM).  

---

