#!/usr/bin/env bash

set -e

# TODO: do this dynamically...

pushd modules/frontend/
bash build-scripts/package.sh
popd

pushd modules/infrastructure/
bash build-scripts/package.sh
popd
