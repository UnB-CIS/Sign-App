# Assinatura de Release (Android)

Por padrão, builds de release usam o `debug.keystore` (apenas para
desenvolvimento). Para gerar APKs/AABs distribuíveis é preciso assinar com um
keystore de release próprio.

> **Nunca** faça commit de um keystore real nem das suas senhas. O `.gitignore`
> já ignora `*.keystore` e `*.jks` (mantendo apenas o `debug.keystore`).

## 1. Gerar o keystore

Execute uma vez e guarde o arquivo `.keystore` num local seguro (fora do repo):

```bash
keytool -genkeypair -v \
  -keystore signapp-release.keystore \
  -alias signapp \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

O comando pede uma senha do keystore, dados do certificado e a senha da chave.
Anote a senha do keystore, o alias (`signapp`) e a senha da chave — serão usados
nas propriedades abaixo.

## 2. Setar as propriedades gradle

O `android/app/build.gradle` lê estas propriedades (somente ativadas quando
`MYAPP_RELEASE_STORE_FILE` existe):

- `MYAPP_RELEASE_STORE_FILE` — caminho do arquivo `.keystore`
- `MYAPP_RELEASE_STORE_PASSWORD` — senha do keystore
- `MYAPP_RELEASE_KEY_ALIAS` — alias da chave (ex.: `signapp`)
- `MYAPP_RELEASE_KEY_PASSWORD` — senha da chave

### Desenvolvimento local

Defina as propriedades em `~/.gradle/gradle.properties` (fora do repositório,
nunca dentro dele):

```properties
MYAPP_RELEASE_STORE_FILE=/caminho/seguro/signapp-release.keystore
MYAPP_RELEASE_STORE_PASSWORD=********
MYAPP_RELEASE_KEY_ALIAS=signapp
MYAPP_RELEASE_KEY_PASSWORD=********
```

Como alternativa, passe na linha de comando:

```bash
./gradlew assembleRelease \
  -PMYAPP_RELEASE_STORE_FILE=/caminho/signapp-release.keystore \
  -PMYAPP_RELEASE_STORE_PASSWORD=*** \
  -PMYAPP_RELEASE_KEY_ALIAS=signapp \
  -PMYAPP_RELEASE_KEY_PASSWORD=***
```

Se nenhuma dessas propriedades estiver definida, o build de release cai
automaticamente no `debug.keystore`, evitando quebrar o build local.

## 3. Configurar secrets na CI (GitHub Actions)

1. Codifique o keystore em base64 e adicione como secret:

   ```bash
   base64 -w0 signapp-release.keystore
   ```

   Crie os secrets no repositório (Settings > Secrets and variables > Actions):

   - `ANDROID_KEYSTORE_BASE64` — saída do comando acima
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`

2. No workflow, recrie o arquivo e exporte as propriedades antes do build:

   ```yaml
   - name: Restaurar keystore
     run: echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > $RUNNER_TEMP/release.keystore

   - name: Build release
     working-directory: android
     run: ./gradlew assembleRelease
     env:
       ORG_GRADLE_PROJECT_MYAPP_RELEASE_STORE_FILE: ${{ runner.temp }}/release.keystore
       ORG_GRADLE_PROJECT_MYAPP_RELEASE_STORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
       ORG_GRADLE_PROJECT_MYAPP_RELEASE_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
       ORG_GRADLE_PROJECT_MYAPP_RELEASE_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
   ```

   O prefixo `ORG_GRADLE_PROJECT_` faz o Gradle expor a variável de ambiente
   como propriedade de projeto (ex.: `MYAPP_RELEASE_STORE_FILE`).
