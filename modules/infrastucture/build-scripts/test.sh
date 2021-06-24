#!/usr/bin/env bash

set -e

PAGER=cat aws cloudformation validate-template --template-body=file://cloudformation/dynamodb.yml
