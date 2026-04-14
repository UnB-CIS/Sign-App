# Backend Issues Para Linear

Cada bloco abaixo foi escrito para ser usado como uma issue individual no Linear.

---

## 📌 Título da Issue
[Backend] Definir e versionar a configuração do Firebase no repositório

---

### 🎯 Descrição
Hoje o projeto inicializa Firebase no app, mas o repositório não contém arquivos de infraestrutura como `firebase.json`, `firestore.rules`, `storage.rules` ou uma configuração documentada de emuladores. Isso deixa segurança, ambientes locais e deploys pouco padronizados.

### ✅ Critérios de Aceitação
- [ ] O repositório possui `firebase.json` com configuração mínima de emuladores e serviços usados pelo app.
- [ ] Existem arquivos versionados de regras do Firestore e do Storage.
- [ ] O fluxo local de desenvolvimento com Firebase Emulator está documentado.
- [ ] Existe uma orientação clara para diferenciar ambiente local, staging e produção.

### 📝 Checklist de Tarefas
- [ ] Criar `firebase.json`.
- [ ] Criar `firestore.rules`.
- [ ] Criar `storage.rules`.
- [ ] Documentar comandos para subir emuladores.
- [ ] Documentar como apontar o app para ambiente local quando necessário.

---

## 📌 Título da Issue
[Backend] Implementar upload real de mídia no Firebase Storage

---

### 🎯 Descrição
O app já prevê uso de imagens para avatar e bug report, mas hoje não existe upload real para Storage. No cadastro, apenas o caminho lógico da imagem é salvo; no bug report, o anexo ainda está marcado como "em desenvolvimento".

### ✅ Critérios de Aceitação
- [ ] O app consegue fazer upload de avatar do usuário para o Firebase Storage.
- [ ] O app consegue anexar imagens em bug reports e persistir as URLs no Firestore.
- [ ] Existe tratamento de erro para falha de upload e limite de quantidade/tamanho de imagens.
- [ ] As regras do Storage restringem acesso de escrita a usuários autenticados.

### 📝 Checklist de Tarefas
- [ ] Definir estrutura de pastas no Storage para avatares e bug reports.
- [ ] Implementar serviço de upload e remoção de arquivos.
- [ ] Persistir `profilePictureUrl` com URL utilizável pelo app.
- [ ] Persistir `imageUrls` em `bugReports`.
- [ ] Validar limite de anexos e tamanho máximo.

---

## 📌 Título da Issue
[Backend] Persistir todos os campos do perfil do usuário

---

### 🎯 Descrição
A tela de edição de perfil já expõe `name`, `phone`, `gender` e `birth_date`, mas atualmente apenas `name` é salvo no Firestore. Falta consolidar o schema do usuário e persistir os demais campos de forma consistente.

### ✅ Critérios de Aceitação
- [ ] O documento de `users` contempla nome, telefone, gênero e data de nascimento.
- [ ] A tela de perfil exibe os novos campos persistidos.
- [ ] A edição de perfil salva todos os campos suportados pelo formulário.
- [ ] Existe validação básica para os novos atributos antes de persistir.

### 📝 Checklist de Tarefas
- [ ] Atualizar a tipagem do usuário no serviço.
- [ ] Salvar `phone`, `gender` e `birth_date` no Firestore.
- [ ] Carregar os campos persistidos na tela de edição.
- [ ] Exibir os campos relevantes na tela de perfil.
- [ ] Definir valores opcionais e regras de validação.

---

## 📌 Título da Issue
[Backend] Migrar cursos e lições de dados locais para Firestore

---

### 🎯 Descrição
As telas de `Home`, `ModuleDetail` e `SignTeaching` ainda dependem de `src/data/modules.ts`. Embora já exista uma camada de serviços para `courses` e `lessons`, ela ainda não está sendo usada pela experiência principal do app.

### ✅ Critérios de Aceitação
- [ ] A listagem de módulos e lições é carregada do Firestore.
- [ ] O app não depende mais de `src/data/modules.ts` como fonte principal de verdade.
- [ ] Existe um fluxo documentado para seed inicial do conteúdo.
- [ ] O app lida com estados de loading, vazio e erro ao buscar conteúdo.

### 📝 Checklist de Tarefas
- [ ] Criar consultas para listar cursos e lições consumidas pela UI.
- [ ] Adaptar `HomeScreen` para carregar conteúdo remoto.
- [ ] Adaptar `ModuleDetailScreen` para carregar lições remotas.
- [ ] Revisar `seedLessons.ts` para garantir uso idempotente e documentado.
- [ ] Remover dependência estrutural dos dados mockados locais.

---

## 📌 Título da Issue
[Backend] Persistir progresso do usuário, XP e ofensiva no Firestore

---

### 🎯 Descrição
Existe um modelo de `progress` e o documento de usuário já prevê `xp`, `xpEarnedThisWeek` e `streak`, mas a jornada principal do app ainda não persiste progresso real de lição concluída, desbloqueio de módulos, ofensiva diária e ganho de XP.

### ✅ Critérios de Aceitação
- [ ] Ao concluir uma lição, o progresso do usuário é persistido no Firestore.
- [ ] O app registra pontuação por lição, XP acumulado e ofensiva atual.
- [ ] O desbloqueio de módulos depende do progresso real do usuário.
- [ ] A tela inicial e a tela de perfil refletem os dados persistidos.

### 📝 Checklist de Tarefas
- [ ] Definir a estratégia de identificação do documento de progresso por usuário e curso.
- [ ] Persistir conclusão de lições e score.
- [ ] Atualizar `xp` e `xpEarnedThisWeek` após conclusão.
- [ ] Atualizar `streak.current`, `streak.longest` e `lastPracticedAt`.
- [ ] Usar progresso real para liberar ou bloquear módulos.

---

## 📌 Título da Issue
[Backend] Integrar ranking com leaderboards reais do Firestore

---

### 🎯 Descrição
A tela de ranking ainda usa `MOCK_PLAYERS`, mesmo já existindo uma camada de serviços para `leaderboards`. Falta integrar leitura real, ordenação por critério e destaque do usuário autenticado com dados persistidos.

### ✅ Critérios de Aceitação
- [ ] A tela de ranking carrega participantes de um leaderboard real no Firestore.
- [ ] O ranking suporta ao menos o critério principal de pontuação semanal.
- [ ] O usuário autenticado aparece destacado corretamente quando estiver no ranking.
- [ ] O refresh da tela consulta dados reais em vez de resetar mocks locais.

### 📝 Checklist de Tarefas
- [ ] Conectar `Ranking.tsx` aos serviços de `leaderboards`.
- [ ] Definir como identificar o leaderboard ativo.
- [ ] Mapear o formato dos participantes para a UI.
- [ ] Remover `MOCK_PLAYERS`.
- [ ] Tratar estados de loading, vazio e erro.

---

## 📌 Título da Issue
[Backend] Implementar automação server-side para ciclos de leaderboard

---

### 🎯 Descrição
O modelo de `leaderboards` já prevê `startDate`, `endDate` e `xpEarnedThisWeek`, mas não há automação visível para abertura de novas temporadas, reset semanal de XP ou movimentação de usuários entre rankings. Essa lógica precisa existir no backend, não apenas no cliente.

### ✅ Critérios de Aceitação
- [ ] Existe um fluxo server-side para criar ou encerrar leaderboards por período.
- [ ] O XP semanal é reiniciado no início de um novo ciclo.
- [ ] A aplicação consegue localizar o leaderboard ativo com base na data atual.
- [ ] A lógica crítica não depende de execução manual pelo app cliente.

### 📝 Checklist de Tarefas
- [ ] Definir se a automação será feita por Cloud Functions, job externo ou outro mecanismo.
- [ ] Criar rotina para abertura de novo ciclo semanal.
- [ ] Criar rotina para fechamento do ciclo anterior.
- [ ] Revisar impacto no campo `xpEarnedThisWeek`.
- [ ] Documentar operação e monitoramento do processo.

---

## 📌 Título da Issue
[Backend] Revisar o fluxo de sessão local para não tratar UID como token

---

### 🎯 Descrição
Atualmente o `AuthContext` persiste o `uid` do Firebase no AsyncStorage sob a chave `@App:token`. Isso funciona como estado local de navegação, mas não representa um token real de autenticação e pode gerar confusão na evolução da arquitetura.

### ✅ Critérios de Aceitação
- [ ] O app deixa de tratar `uid` como token de API.
- [ ] O nome da chave e do estado local reflete corretamente seu propósito.
- [ ] O fluxo de autenticação permanece funcional após a refatoração.
- [ ] Existe documentação breve explicando a estratégia adotada para sessão local.

### 📝 Checklist de Tarefas
- [ ] Renomear o estado salvo localmente para algo semântico.
- [ ] Revisar chamadas de `signIn` e `signOut` do contexto.
- [ ] Garantir compatibilidade com o listener de `onAuthStateChanged`.
- [ ] Limpar dependências futuras em cima do pseudo-token atual.

---

## 📌 Título da Issue
[Backend] Aumentar a cobertura de testes da camada de serviços Firebase

---

### 🎯 Descrição
Hoje há poucos testes cobrindo a camada que conversa com Firebase. Como o app depende diretamente de Auth e Firestore, vale fortalecer a cobertura com casos reais em emulator e testes unitários para fluxos críticos.

### ✅ Critérios de Aceitação
- [ ] Existem testes para cadastro, login, atualização de perfil e bug report.
- [ ] Existem testes para progresso, cursos, lições e leaderboards.
- [ ] Os testes críticos podem rodar contra Firebase Emulator localmente.
- [ ] O fluxo de execução dos testes está documentado.

### 📝 Checklist de Tarefas
- [ ] Mapear os fluxos críticos da camada de serviços.
- [ ] Adicionar testes unitários e de integração com emulator.
- [ ] Documentar setup local dos testes.
- [ ] Garantir limpeza de dados criados durante os testes.

