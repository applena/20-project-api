#!/usr/bin/env bash

ROLE_NAME=user
USER_NAME=${1:-bob}
CAPABILITIES='["read"]'

# creates a user role and captures the JWT in $USER_TOKEN
export ROLE_TOKEN=$(http -h POST :3000/newRole role=$ROLE_NAME capabilities:=$CAPABILITIES | grep token | awk '{print $2}')

# Create a user with the role
export USER_TOKEN=$(http POST :3000/signup username=$USER_NAME password=yo role=user)

# Change user token into a Key
export USER_KEY=$(http POST :3000/key authorization:bearer\ $USER_TOKEN)
