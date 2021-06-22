#!/usr/bin/env bash

set -e

# TODO: someday make this discovery automatic..

pushd modules/frontend
bash build-scripts/pre-build.sh && true
popd
