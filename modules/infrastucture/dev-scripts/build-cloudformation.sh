#!/usr/bin/env bash

PAGER=cat aws cloudformation create-stack --stack-name="mindmaper-local" --template-body=file://cloudformation/dynamodb.yml --parameters ParameterKey=Environment,ParameterValue=local-dev-rpw --profile=wdstatic --tags Key=PROJECT,Value=markdown-map
