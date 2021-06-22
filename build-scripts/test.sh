#!/usr/bin/env bash

set -e

pushd modules/frontend/
build-scripts/test.sh && true
popd
