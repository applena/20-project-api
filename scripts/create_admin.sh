#!/usr/bin/env bash

ROLE_NAME=admin
USER_NAME=${1:-root}
CAPABILITIES='["read","write","update","delete"]'

# creates a user role and captures the JWT in $USER_TOKEN
export ROLE_TOKEN=$(http -h POST :3000/newRole role=$ROLE_NAME capabilities:=$CAPABILITIES | grep token | awk '{print $2}')

# Create a user with the role
export ADMIN_TOKEN=$(http POST :3000/signup username=$USER_NAME password=yo role=user)

# Change user token into a Key
export ADMIN_KEY=$(http POST :3000/key authorization:bearer\ $ADMIN_TOKEN)