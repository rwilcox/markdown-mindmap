#!/usr/bin/env bash

set -e

# TODO: someday make this discovery automatic..
NET_TASK_BIN=/tmp/net-task

$NET_TASK_BIN run frontend:install

pushd modules/infrastructure
bash build-scripts/pre-build.sh && true
popd
