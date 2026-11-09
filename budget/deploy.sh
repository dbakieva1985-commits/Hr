#!/bin/bash
# Выкладывает папку budget из репозитория в Firebase Hosting. Остальные файлы репозитория не трогает.
set -e
cd ~ && rm -rf fb && git clone -q --depth 1 https://github.com/dbakieva1985-commits/Hr fb && cd fb
cat > firebase.json <<'J'
{"hosting":{"public":"budget","ignore":["README.md","deploy.sh"],
 "headers":[{"source":"**","headers":[{"key":"Cache-Control","value":"no-cache"}]}]}}
J
firebase deploy --only hosting --project family-budget-a92be --non-interactive
