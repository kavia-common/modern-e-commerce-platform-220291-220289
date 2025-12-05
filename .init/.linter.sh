#!/bin/bash
cd /home/kavia/workspace/code-generation/modern-e-commerce-platform-220291-220289/ecommerce_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

