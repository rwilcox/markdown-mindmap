#!/bin/bash

bundle exec cody start --branch=$(git rev-parse --abbrev-ref HEAD)
