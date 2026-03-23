#!/bin/bash
set -e

# Define o modo de execução. Pega o primeiro argumento ($1). Se não houver, usa 'emulator' como padrão.
MODE=${1:-emulator}

# Define cores para os logs
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Função para logar mensagens
log() {
  echo -e "\n${GREEN}[INFO]${NC} $1"
}

# PASSO 0: Verificar se o ANDROID_HOME está configurado
if [ -z "$ANDROID_HOME" ]; then
  echo "Erro: A variável de ambiente ANDROID_HOME não está definida."
  exit 1
fi
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

# PASSO 1: Iniciar o Metro Bundler diretamente no host (com reset de cache)
log "Iniciando o Metro Bundler no host..."
npx react-native start --host 0.0.0.0 --reset-cache &
METRO_PID=$!

# PASSO 2: Aguardar a PORTA 8081 ficar pronta
log "Aguardando a porta 8081 ficar pronta..."
until /usr/bin/nc -zvw1 127.0.0.1 8081 &> /dev/null; do
  echo -n "."
  sleep 2
done
log "Porta 8081 detectada! Prosseguindo..."

# ==================================================================
# PASSO 3, 4, 5: LÓGICA CONDICIONAL PARA EMULADOR OU DISPOSITIVO
# ==================================================================
if [ "$MODE" == "emulator" ]; then
  # --- Bloco de código para o Emulador ---
  log "Modo Emulador selecionado."

  log "Procurando por emuladores (AVDs)..."
  AVD_NAME=$(emulator -list-avds | head -n 1)
  if [ -z "$AVD_NAME" ]; then
    echo "Erro: Nenhum emulador (AVD) encontrado."
    kill $METRO_PID 2>/dev/null
    exit 1
  fi
  log "Usando o emulador: $AVD_NAME"

  log "Iniciando o emulador..."
  nohup emulator -avd "$AVD_NAME" > /dev/null 2>&1 &

  log "Aguardando o emulador inicializar por completo..."
  adb wait-for-device
  until [[ "$(adb shell getprop sys.boot_completed | tr -d '\r\n')" == "1" ]]; do
    echo -n "."
    sleep 2
  done
  log "Emulador pronto!"

elif [ "$MODE" == "device" ]; then
  # --- Bloco de código para o Dispositivo Físico ---
  log "Modo Dispositivo Físico selecionado."
  log "Aguardando dispositivo físico via USB... (Certifique-se de que a depuração USB está ativada e autorizada)"
  adb wait-for-device
  log "Dispositivo físico detectado!"

else
  # --- Bloco de Erro para opção inválida ---
  echo "Erro: Modo inválido '$MODE'. Use 'emulator' ou 'device'."
  kill $METRO_PID 2>/dev/null
  exit 1
fi

# PASSO 6: Configurar o redirecionamento de porta
log "Configurando 'adb reverse' para a porta 8081..."
adb reverse tcp:8081 tcp:8081

# PASSO 7: Build e Instalação via Gradle
log "Garantindo permissão de execução para o gradlew..."
chmod +x android/gradlew
log "Compilando o app com Gradle (assembleDebug)..."
(cd android && ./gradlew assembleDebug)
log "Instalando o app no dispositivo (installDebug)..."
(cd android && ./gradlew installDebug)
PACKAGE_NAME="com.signapp"
log "Iniciando o app ($PACKAGE_NAME) no dispositivo..."
adb shell am start -n "$PACKAGE_NAME/$PACKAGE_NAME.MainActivity"

log "Setup concluído! Metro rodando em background (PID: $METRO_PID). O app está iniciando no dispositivo."
log "Para parar o Metro: kill $METRO_PID"

# Mantém o Metro em foreground
wait $METRO_PID
