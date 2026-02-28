#!/bin/bash

# Script wrapper para remover CODE_SIGN_IDENTITY dos argumentos do xcodebuild

# Coleta todos os argumentos passados para o script
ARGS=("$@")

# Inicializa um array vazio para os novos argumentos
NEW_ARGS=()

# Itera sobre os argumentos originais
for i in "${!ARGS[@]}"; do
  arg="${ARGS[$i]}"
  
  # Verifica se o argumento atual é CODE_SIGN_IDENTITY ou começa com ele
  if [[ "$arg" == "CODE_SIGN_IDENTITY="* ]]; then
    echo "Removendo argumento de assinatura global: $arg"
  else
    # Adiciona o argumento ao novo array se não for CODE_SIGN_IDENTITY
    NEW_ARGS+=("$arg")
  fi
done

# Executa o xcodebuild com os argumentos filtrados
echo "Executando xcodebuild com argumentos modificados: ${NEW_ARGS[@]}"
xcodebuild "${NEW_ARGS[@]}"
