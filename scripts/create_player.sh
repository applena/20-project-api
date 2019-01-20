#!/usr/bin/env bash

ADMIN_KEY=$1
NAME=${2:-playertest}
POSITION=${3:-P}
THROWS=${4:-R}
BATS=${5:-R}
TEAM=${6:-CATS}

export PLAYER_TOKEN=$(http :3000/api/v1/players name=$NAME position=$POSITION throws=$THROWS bats=$BATS team=$TEAM authorization:bearer\ $ADMIN_KEY)