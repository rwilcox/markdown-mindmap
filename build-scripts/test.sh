#!/usr/bin/env bash

set -e

NET_TASK_BIN=/tmp/net-task

$NET_TASK_BIN run frontend:test


pushd modules/infrastructure/
build-scripts/test.sh && true
popd
