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
Para Storage gratuitos temos como opção:


---

### 🔹 Banco de Dados e Armazenamento

- **Cloud Firestore (NoSQL)**  
  - Banco de dados não relacional, baseado em documentos.  
  - Sincronização em tempo real entre usuários e dispositivos.  
  - Escalabilidade automática e integrada ao ecossistema Firebase.  
  - Pode armazenar **metadados de arquivos**, como links de vídeos, timestamps e status, enquanto os arquivos reais ficam em um serviço de storage.

- **Cloudflare R2 (Storage de Vídeos)**  
  - Serviço de armazenamento de arquivos **S3-compatible**.  
  - **Free Tier:** 10 GB de armazenamento + 1 milhão de requisições/mês.  
  - **Vantagem:** **Sem taxas de egress** (downloads gratuitos).  
  - **Cartão:** ✅ Não exige cartão de crédito.  
  - **Integração:** Pode ser usado em conjunto com Firestore, salvando apenas o **link/objeto R2** nos documentos do Firestore para relacionar vídeos a usuários, datas e status.  

- **Backblaze B2 (Storage de Vídeos)**  
  - **Free Tier:** 10 GB de armazenamento + 1 GB de download/dia.  
  - **Cartão:** ✅ Não exige cartão de crédito.  
  - **Vantagem:** Preço muito baixo caso ultrapasse o limite gratuito.  
  - **Integração:** Igual ao R2, os arquivos ficam no B2 e apenas os metadados e links são salvos no Firestore.



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

