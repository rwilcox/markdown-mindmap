#!/usr/bin/env bash

set -e

NET_TASK_BIN=/tmp/net-task
$NET_TASK_BIN run frontend:ci:package

pushd modules/infrastructure/
bash build-scripts/package.sh
popd
